// lib/auth/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

// Vérifiez que les variables d'environnement requises sont définies
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn("⚠️ GOOGLE_CLIENT_ID is not defined");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("⚠️ GOOGLE_CLIENT_SECRET is not defined");
}

if (!process.env.GITHUB_SECRET) {
  console.warn("GITHUB_SECRET is not defined");
}

if (!process.env.GITHUB_ID) {
  console.warn("GITHUB_ID is not defined");
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
          throw new Error("Email and password are required");
        }

        try {
          console.log("Attempting login for:", credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            console.log("User not found");
            throw new Error("Invalid credentials");
          }

          if (!user.password) {
            console.log("User has no password (provider account?)");
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            console.log("Invalid password");
            throw new Error("Invalid credentials");
          }

          console.log("Login successful for user:", user.id);

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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  callbacks: {

    async signIn({ user, account, profile, email }) {
      // Permettre la liaison de compte OAuth avec un compte existant
      if (account?.provider !== "credentials") {
        // Vérifier si l'utilisateur existe déjà par email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Vérifier si le compte OAuth est déjà lié
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account?.provider,
              providerAccountId: account?.providerAccountId,
            },
          });

          // Si pas encore lié, créer la liaison
          if (!existingAccount && account) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            console.log(`Compte ${account.provider} lié pour: ${user.email}`);
          }

          // Mettre à jour l'ID de l'utilisateur pour la session
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Persist user data to token
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || "FREE";
        token.credits = (user as any).credits || 0;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ token, session }) {
      console.log("User signed out");
    },
    async createUser({ user }) {
      console.log("New user created:", user.email);
    },
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", user.email);
    },
  },
};