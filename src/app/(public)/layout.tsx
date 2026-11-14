import type { Metadata } from "next";
import "@/app/globals.css";
import PublicShell from "@/components/public/PublicShell";

export const metadata: Metadata = {
  title: "Jurisk — Lisez entre les lignes",
  description: "Une lecture claire des risques, obligations et leviers de vos contrats.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
