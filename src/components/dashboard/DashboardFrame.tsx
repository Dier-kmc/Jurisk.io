"use client";

import Link from "next/link";
import { FilePlus2, Files, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCredits } from "@/lib/hooks/useCredits";

export default function DashboardFrame({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { credits } = useCredits();

  return <div className="dashboard-v2 min-h-screen bg-[#f0eee8] text-[#17191d]">
    <header className="border-b border-[#17191d]/20 bg-[#f0eee8]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#2848c7] font-serif text-xl text-white shadow-[4px_4px_0_#17191d]">J/</span><span className="font-semibold tracking-[-.04em]">jurisk<span className="text-[#e86a3a]">.io</span></span></Link>
        <nav className="hidden items-center gap-8 md:flex"><Link href="/upload" className="flex items-center gap-2 text-sm font-semibold text-[#2848c7]"><FilePlus2 size={16} />Nouvelle analyse</Link><Link href="/analyses" className="flex items-center gap-2 text-sm text-[#17191d]/60 hover:text-[#2848c7]"><Files size={16} />Mes analyses</Link></nav>
        <div className="hidden items-center gap-4 md:flex"><div className="border-l border-[#17191d]/20 pl-4 text-right"><p className="text-sm font-semibold">{user?.name || user?.email?.split("@")[0]}</p><p className="text-xs text-[#17191d]/50">{credits ?? "…"} crédit{credits === 1 ? "" : "s"}</p></div><button onClick={() => logout()} aria-label="Se déconnecter" className="text-[#17191d]/55 hover:text-[#2848c7]"><LogOut size={18} /></button></div>
        <button className="md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {menuOpen && <div className="border-t border-[#17191d]/15 px-5 py-4 md:hidden"><div className="flex flex-col gap-4"><Link href="/upload" onClick={() => setMenuOpen(false)} className="font-semibold text-[#2848c7]">Nouvelle analyse</Link><Link href="/analyses" onClick={() => setMenuOpen(false)} className="text-[#17191d]/65">Mes analyses</Link><button onClick={() => logout()} className="flex items-center gap-2 text-left text-[#17191d]/65"><LogOut size={16} />Se déconnecter</button></div></div>}
    </header>
    <main>{children}</main>
  </div>;
}
