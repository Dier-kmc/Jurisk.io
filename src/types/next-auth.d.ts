import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Retourné par `useSession`, `getSession` et reçu en tant que
   * prop dans le composant `SessionProvider`
   */
  interface Session {
    user: {
      id: string;
      plan: string;
      credits: number;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }

  /**
   * Le type User, retourné par l'adaptateur et reçu dans le callback JWT
   */
  interface User {
    id: string;
    plan: string;
    credits: number;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Retourné par le callback `jwt` et `getToken`, reçu dans le callback `session` */
  interface JWT {
    /** ID utilisateur OpenID */
    sub?: string;
    id: string;
    plan: string;
    credits: number;
  }
}