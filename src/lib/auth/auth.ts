// lib/auth/auth.ts
import { Account, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Déterminer l'URL de base pour la production
const getBaseUrl = () => {
  // Priorité 1 : Variable explicite
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Priorité 2 : Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Défaut : localhost
  return "http://localhost:3000";
};

const baseUrl = getBaseUrl();

console.log("🔧 Environment:", process.env.NODE_ENV);
console.log("🔧 Base URL:", baseUrl);
console.log("🔧 VERCEL_URL:", process.env.VERCEL_URL);
console.log("🔧 NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

// Vérifications strictes en production
if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is required in production");
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is required in production");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is required in production");
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            credits: user.credits,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Configuration simplifiée pour production
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
  try {
    if (account?.provider === "google") {
      // Normaliser l'email en minuscules
      const normalizedEmail = user.email!.toLowerCase().trim();
      console.log("Google sign-in for normalized email:", normalizedEmail);
      
      // Rechercher l'utilisateur avec l'email normalisé
      const existingUser = await prisma.user.findUnique({
        where: { 
          email: normalizedEmail // Utiliser l'email normalisé
        },
      });

      if (existingUser) {
        // Mettre à jour l'ID de l'utilisateur
        user.id = existingUser.id;
        
        // Vérifier si le compte Google est déjà lié
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: "google",
            providerAccountId: account.providerAccountId,
          },
        });

        if (!existingAccount && account) {
          // Créer le lien entre les comptes
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
          console.log("Google account linked successfully");
        }

        // Optionnel : Mettre à jour le nom avec la version de Google
        if (user.name && user.name !== existingUser.name) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { name: user.name }
          });
          console.log("Updated user name from Google:", user.name);
        }
      }
    }
    return true;
  } catch (error) {
    console.error("SignIn callback error:", error);
    return false;
  }
},
    // async signIn({ user, account, profile }) {
    //   try {
    //     if (account?.provider === "google") {
    //       console.log("Google sign-in for:", user.email);
          
    //       // Vérifier si l'utilisateur existe
    //       const existingUser = await prisma.user.findUnique({
    //         where: { email: user.email! },
    //       });

    //       if (existingUser) {
    //         // Mettre à jour l'ID de l'utilisateur
    //         user.id = existingUser.id;
            
    //         // Vérifier si le compte Google est déjà lié
    //         const existingAccount = await prisma.account.findFirst({
    //           where: {
    //             userId: existingUser.id,
    //             provider: "google",
    //             providerAccountId: account.providerAccountId,
    //           },
    //         });

    //         if (!existingAccount) {
    //           // Créer le lien entre les comptes
    //           await prisma.account.create({
    //             data: {
    //               userId: existingUser.id,
    //               type: account.type,
    //               provider: account.provider,
    //               providerAccountId: account.providerAccountId,
    //               refresh_token: account.refresh_token,
    //               access_token: account.access_token,
    //               expires_at: account.expires_at,
    //               token_type: account.token_type,
    //               scope: account.scope,
    //               id_token: account.id_token,
    //               session_state: account.session_state,
    //             },
    //           });
    //           console.log("Google account linked successfully");
    //         }
    //       }
    //     }
    //     return true;
    //   } catch (error) {
    //     console.error("SignIn callback error:", error);
    //     return false; // Bloquer la connexion en cas d'erreur
    //   }
    // },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || "FREE";
        token.credits = (user as any).credits || 0;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirection après OAuth
      if (url.includes("/api/auth/callback")) {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // Important pour Vercel
  useSecureCookies: process.env.NODE_ENV === "production",
  
  // Configuration des cookies pour Vercel
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  
  debug: process.env.NODE_ENV === "development",
};