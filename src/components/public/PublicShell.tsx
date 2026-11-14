"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
const links = [
  ["La méthode", "/method"],
  ["Un rapport", "/report"],
  ["Tarifs", "/pricing"],
  ["Ressources", "/resources"],
];
export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="public-v2 min-h-screen bg-[#f0eee8] text-[#17191d]">
      <header className="sticky top-0 z-40 border-b border-[#17191d]/15 bg-[#f0eee8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center bg-[#2848c7] font-serif text-xl text-white">
              J
            </span>
            <span className="font-semibold tracking-[-.04em]">
              jurisk<span className="text-[#e86a3a]">.io</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#17191d]/60 hover:text-[#e86a3a]"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-[#17191d]/65 hover:text-[#17191d]"
            >
              Se connecter
            </Link>
            <Link
              href="/login?callbackUrl=%2Fupload"
              className="bg-[#2848c7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#203aa3]"
            >
              Analyser un contrat <span className="ml-1">↗</span>
            </Link>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-[#17191d]/10 bg-[#f0eee8] px-5 py-4 lg:hidden">
            <nav className="flex flex-col">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#17191d]/10 py-4 text-lg"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Link
              href="/login?callbackUrl=%2Fupload"
              onClick={() => setOpen(false)}
              className="mt-4 block bg-[#2848c7] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Analyser un contrat
            </Link>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-[#2848c7] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <p className="text-2xl font-semibold tracking-[-.05em]">
              jurisk<span className="text-[#e9d98a]">.io</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Une lecture claire des risques, obligations et points à négocier.
            </p>
          </div>
          <Footer
            title="Produit"
            items={[
              ["La méthode", "/method"],
              ["Un rapport", "/report"],
              ["Tarifs", "/pricing"],
            ]}
          />
          <Footer
            title="Ressources"
            items={[
              ["Guides", "/resources"],
              ["État du service", "/status"],
            ]}
          />
          <Footer
            title="Légal"
            items={[
              ["Confidentialité", "/privacy"],
              ["Conditions", "/terms"],
              ["Accessibilité", "/accessibility"],
            ]}
          />
        </div>
        <div className="border-t border-white/15 px-5 py-5 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Jurisk.io · Une aide à la décision, pas
          un avis juridique.
        </div>
      </footer>
    </div>
  );
}
function Footer({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#e9d98a]">
        {title}
      </p>
      <div className="flex flex-col gap-3 text-sm text-white/60">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
