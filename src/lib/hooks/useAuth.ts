'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  plan: string;
  credits: number;
}

export function useAuth() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  
  const isLoading = status === "loading" || loading;
  const isAuthenticated = status === "authenticated";
  const user = session?.user as AuthUser | null;
  
  const login = async (provider?: string, credentials?: { email: string; password: string }) => {
    try {
      setLoading(true);
      
      if (provider === "credentials" && credentials) {
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }
        
        if (result?.ok) {
          router.refresh(); // Revalider les données
        }
      } else if (provider) {
        await signIn(provider);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      // router.push('/');
      // router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshSession = async () => {
    await update();
  };
  
  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshSession,
    hasPremium: user?.plan === "PREMIUM",
    hasCredits: (user?.credits || 0) > 0,
    remainingCredits: user?.credits || 0
  };
}