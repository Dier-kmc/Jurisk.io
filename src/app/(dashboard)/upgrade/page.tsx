"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock3, FilePlus2, Files } from "lucide-react";
import { CREDIT_PACKS, CURRENCY_SYMBOLS } from "@/lib/constants/plans";
import { useCredits } from "@/lib/hooks/useCredits";

export default function UpgradePage() {
  const { credits, loading } = useCredits();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
      <section className="grid gap-10 border-b border-[#17191d]/15 pb-14 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Continuer votre lecture</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[.94] tracking-[-.07em] sm:text-7xl">
            Un contrat important mérite plus qu’un seul regard.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#17191d]/60">
            Ajoutez des crédits quand vous en avez besoin. Vos analyses restent disponibles dans votre espace, sans abonnement imposé.
          </p>
        </div>
        <div className="border border-[#17191d]/20 bg-[#fffdf8] p-6 lg:justify-self-end lg:min-w-72">
          <p className="text-sm text-[#17191d]/55">Votre solde actuel</p>
          <p className="mt-3 font-serif text-6xl tracking-[-.07em] text-[#2848c7]">
            {loading ? "…" : credits ?? 0}
          </p>
          <p className="mt-1 text-sm text-[#17191d]/55">crédit{credits === 1 ? "" : "s"} disponible{credits === 1 ? "" : "s"}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Packs de crédits</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-.06em]">Choisissez votre prochain volume.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#17191d]/55">Les paiements en ligne arrivent bientôt. Vous pouvez déjà voir les options prévues.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <article key={pack.id} className={`relative flex flex-col border p-6 ${pack.popular ? "border-[#2848c7] bg-[#2848c7] text-white" : "border-[#17191d]/15 bg-[#fffdf8]"}`}>
              {pack.badge && <span className="absolute right-5 top-5 bg-[#e9d98a] px-2 py-1 text-xs font-bold text-[#17191d]">{pack.badge}</span>}
              <p className={`text-xs font-bold uppercase tracking-[.2em] ${pack.popular ? "text-[#e9d98a]" : "text-[#e86a3a]"}`}>{pack.name}</p>
              <p className="mt-8 font-serif text-5xl tracking-[-.07em]">{pack.price.toString().replace(".", ",")}{CURRENCY_SYMBOLS[pack.currency]}</p>
              <p className={`mt-2 text-sm ${pack.popular ? "text-white/70" : "text-[#17191d]/55"}`}>{pack.description}</p>
              <ul className={`mt-8 flex-1 space-y-4 border-t pt-6 text-sm ${pack.popular ? "border-white/25 text-white/80" : "border-[#17191d]/10 text-[#17191d]/65"}`}>
                {pack.features.map((feature) => <li key={feature} className="flex gap-3"><Check size={16} className={`mt-0.5 shrink-0 ${pack.popular ? "text-[#e9d98a]" : "text-[#2848c7]"}`} />{feature}</li>)}
              </ul>
              <button type="button" disabled className={`mt-9 flex items-center justify-center gap-2 border px-4 py-3 text-sm font-bold opacity-75 ${pack.popular ? "border-white/40 text-white" : "border-[#17191d]/25 text-[#17191d]"}`}>
                <Clock3 size={15} /> Bientôt disponible
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-4 border-t border-[#17191d]/15 pt-8">
        <Link href="/upload" className="inline-flex items-center gap-2 bg-[#2848c7] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#17191d]">Nouvelle analyse <FilePlus2 size={16} /></Link>
        <Link href="/analyses" className="inline-flex items-center gap-2 border border-[#17191d]/25 px-5 py-3 text-sm font-bold">Voir mes analyses <Files size={16} /></Link>
        <Link href="/pricing" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#2848c7]">Voir les tarifs publics <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
