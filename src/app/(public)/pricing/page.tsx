import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { EndNote, Intro } from "@/components/public/PublicUI";
import { CREDIT_PACKS, CURRENCY_SYMBOLS } from "@/lib/constants/plans";

export default function PricingPage() {
  return <>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28"><Intro eyebrow="Tarifs" title={<>Un prix clair pour une lecture <em className="text-[#e86a3a]">utile.</em></>} text="Commencez avec les crédits inclus, puis ajoutez un pack quand vos contrats l’exigent, sans abonnement forcé." /></section>
    <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:grid-cols-3 lg:px-10">
      {CREDIT_PACKS.map((pack, index) => <article key={pack.id} className={`relative flex flex-col border p-6 sm:p-7 ${pack.popular ? "border-[#2848c7] bg-[#2848c7] text-white" : "border-[#17191d]/15 bg-[#fffdf8]"}`}>
        {pack.badge && <span className="absolute right-5 top-5 bg-[#e9d98a] px-2 py-1 text-xs font-bold text-[#17191d]">{pack.badge}</span>}
        <p className={`text-xs font-bold uppercase tracking-[.2em] ${pack.popular ? "text-[#e9d98a]" : "text-[#e86a3a]"}`}>{pack.name}</p>
        <p className="mt-8 font-serif text-5xl tracking-[-.07em]">{pack.price.toString().replace(".", ",")}{CURRENCY_SYMBOLS[pack.currency]}</p>
        <p className={`mt-2 text-sm ${pack.popular ? "text-white/60" : "text-[#17191d]/55"}`}>{pack.description}</p>
        <ul className={`mt-8 flex-1 space-y-4 border-t pt-7 text-sm ${pack.popular ? "border-white/20 text-white/70" : "border-[#17191d]/10 text-[#17191d]/65"}`}>
          {pack.features.map((feature) => <li key={feature} className="flex gap-3"><Check size={16} className={`shrink-0 ${pack.popular ? "text-[#e9d98a]" : "text-[#2848c7]"}`} />{feature}</li>)}
        </ul>
        <Link href="/login?callbackUrl=%2Fupload" className={`mt-9 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold ${pack.popular ? "bg-[#e9d98a] text-[#17211b]" : "bg-[#2848c7] text-white"}`}>Choisir ce pack <ArrowRight size={15} /></Link>
      </article>)}
    </section>
    <EndNote />
  </>;
}
