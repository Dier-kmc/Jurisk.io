"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import DashboardFrame from "@/components/dashboard/DashboardFrame";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login?callbackUrl=%2Fupload");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="dashboard-v2 flex min-h-screen items-center justify-center bg-[#f0eee8] text-[#2848c7]"><LoaderCircle className="animate-spin" size={24} /></div>;
  }

  return <DashboardFrame>{children}</DashboardFrame>;
}
