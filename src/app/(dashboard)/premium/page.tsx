import Link from "next/link";
import { ArrowRight, Check, FilePlus2, Files, LockKeyhole } from "lucide-react";
import { FEATURES } from "@/lib/constants/features";

const premiumFeatures = FEATURES.filter((feature) => feature.plans.includes("premium"));

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
      <section className="grid gap-10 border-b border-[#17191d]/15 pb-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Votre espace Premium</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[.94] tracking-[-.07em] sm:text-7xl">Plus de profondeur pour vos décisions contractuelles.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#17191d]/60">Retrouvez ici les fonctions réservées à votre plan et lancez directement une nouvelle lecture.</p>
        </div>
        <div className="border border-[#2848c7] bg-[#2848c7] p-6 text-white shadow-[6px_6px_0_#17191d]">
          <LockKeyhole size={22} className="text-[#e9d98a]" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-[#e9d98a]">Accès actif</p>
          <p className="mt-3 font-serif text-3xl tracking-[-.04em]">Votre plan Premium est activé.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Fonctionnalités incluses</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-.06em]">Tout ce qu’il faut pour aller plus loin.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#17191d]/55">Chaque fonction relie les signaux détectés au texte qui les justifie.</p>
        </div>

        <div className="mt-10 grid gap-px border border-[#17191d]/15 bg-[#17191d]/15 sm:grid-cols-2 lg:grid-cols-3">
          {premiumFeatures.map((feature) => (
            <article key={feature.id} className="bg-[#fffdf8] p-6">
              <div className="flex items-start justify-between gap-4"><span className="text-2xl" aria-hidden="true">{feature.icon}</span><Check size={18} className="text-[#2848c7]" /></div>
              <h3 className="mt-8 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#17191d]/55">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-4 border-t border-[#17191d]/15 pt-8">
        <Link href="/upload" className="inline-flex items-center gap-2 bg-[#2848c7] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#17191d]">Lancer une analyse <FilePlus2 size={16} /></Link>
        <Link href="/analyses" className="inline-flex items-center gap-2 border border-[#17191d]/25 px-5 py-3 text-sm font-bold">Voir mes analyses <Files size={16} /></Link>
        <Link href="/" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#2848c7]">Retour à l’accueil <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
