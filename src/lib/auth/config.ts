// import { NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/db/client";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma) as any,

//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Mot de passe", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email et mot de passe requis");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           throw new Error("Utilisateur non trouvé");
//         }

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password,
//         );

//         if (!isValid) {
//           throw new Error("Mot de passe incorrect");
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           plan: user.plan || "FREE",
//           credits: user.credits || 10,
//         };
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//     }),

//     GitHubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       // Premier appel JWT - user est disponible
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.image = user.image;
//         token.plan = (user as any).plan || "FREE";
//         token.credits = (user as any).credits || 10;
//       }

//       // Appels suivants - token existe déjà
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//         session.user.image = token.image as string;
//         session.user.plan = token.plan as string;
//         session.user.credits = token.credits as number;
//       }
//       return session;
//     },
//   },

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 jours
//   },

//   jwt: {
//     maxAge: 30 * 24 * 60 * 60, // 30 jours
//   },

//   secret: process.env.NEXTAUTH_SECRET,

//   // Important pour le debug
//   debug: process.env.NODE_ENV === "development",

//   // Cookies configuration
//   cookies: {
//     sessionToken: {
//       name:
//         process.env.NODE_ENV === "production"
//           ? "__Secure-next-auth.session-token"
//           : "next-auth.session-token",
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
// };

// // Configuration pour le middleware et autres utilitaires
// export const authConfig = {
//   secret: process.env.NEXTAUTH_SECRET!,
//   cookieName:
//     process.env.NODE_ENV === "production"
//       ? "__Secure-next-auth.session-token"
//       : "next-auth.session-token",
//   baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
// };
