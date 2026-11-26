import Link from "next/link";
import { ArrowRight, FilePlus2, FileSearch, Home, Sparkles } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#f0eee8] text-[#17191d]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#17191d]/15 pb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[#2848c7] font-serif text-xl text-white shadow-[4px_4px_0_#17191d]">J/</span>
            <span className="font-semibold tracking-[-.04em]">jurisk<span className="text-[#e86a3a]">.io</span></span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-[#17191d]/40">Erreur 404</span>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_.8fr] lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Cette page n’est pas dans le dossier</p>
            <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[.9] tracking-[-.08em] sm:text-8xl">On a perdu la clause.</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#17191d]/60">L’adresse demandée n’existe pas ou a été déplacée. Revenez à votre espace pour continuer à lire votre contrat.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/" className="inline-flex items-center gap-2 bg-[#2848c7] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#17191d]"><Home size={16} /> Accueil</Link>
              <Link href="/upload" className="inline-flex items-center gap-2 border border-[#17191d]/25 px-5 py-3 text-sm font-bold"><FilePlus2 size={16} /> Nouvelle analyse</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
            <div className="absolute -inset-8 bg-[#e9d98a]/40 blur-3xl" aria-hidden="true" />
            <div className="relative border border-[#17191d]/20 bg-[#fffdf8] p-7 shadow-[8px_8px_0_#17191d]">
              <div className="flex items-center justify-between border-b border-[#17191d]/15 pb-5"><span className="font-serif text-5xl tracking-[-.08em] text-[#2848c7]">404</span><FileSearch size={28} className="text-[#e86a3a]" /></div>
              <div className="mt-8 space-y-5"><div className="h-3 w-4/5 bg-[#17191d]/10" /><div className="h-3 w-full bg-[#17191d]/10" /><div className="h-3 w-3/5 bg-[#17191d]/10" /></div>
              <div className="mt-10 border-l-2 border-[#2848c7] pl-4 text-sm leading-6 text-[#17191d]/60">« Le document demandé reste à retrouver. »</div>
              <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2848c7]">Découvrir Jurisk <ArrowRight size={15} /></Link>
            </div>
            <Sparkles className="absolute -right-4 -top-5 text-[#e86a3a]" size={22} aria-hidden="true" />
          </div>
        </section>

        <footer className="border-t border-[#17191d]/15 pt-5 text-xs text-[#17191d]/45">Une aide à la décision, pas un avis juridique.</footer>
      </div>
    </main>
  );
}
