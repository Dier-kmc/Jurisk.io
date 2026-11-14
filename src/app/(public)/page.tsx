import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { benefits, ClauseMap, EndNote, Feature } from "@/components/public/PublicUI";

export default function HomePage() {
  return <>
    <section className="border-b border-[#17191d]/15">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-10 lg:py-28">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Une seconde lecture avant la signature</p>
          <h1 className="mt-6 max-w-2xl font-serif text-6xl leading-[.88] tracking-[-.07em] sm:text-8xl">Comprendre avant de <em className="text-[#e86a3a]">signer.</em></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#17191d]/60">Jurisk transforme un contrat dense en une lecture claire des risques, obligations et points à négocier.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5"><Link href="/login?callbackUrl=%2Fupload" className="inline-flex items-center gap-2 bg-[#1f4a3a] px-6 py-4 text-sm font-bold text-[#f5f1e8]">Analyser un contrat <ArrowUpRight size={16} /></Link><Link href="/report" className="text-sm font-bold text-[#1f4a3a]">Voir un rapport type</Link></div>
        </div>
        <ClauseMap />
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28"><div className="mb-12 max-w-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Le produit en pratique</p><h2 className="mt-5 font-serif text-5xl leading-none tracking-[-.06em]">Un rapport pensé pour l’action.</h2></div><div className="grid gap-10 sm:grid-cols-3">{benefits.map(({ icon, title, text }) => <Feature key={title} icon={icon} title={title}>{text}</Feature>)}</div></section>
    <section className="border-y border-[#17191d]/15 bg-[#e5e1d7]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Une analyse utile</p><h2 className="mt-5 max-w-md font-serif text-5xl leading-none tracking-[-.06em]">Chaque signal répond à une vraie question.</h2></div><div className="space-y-4">{[["01","Qu’est-ce que la clause dit ?","L’extrait exact, remis dans son contexte."],["02","Pourquoi cela compte pour vous ?","La conséquence concrète sur votre partie."],["03","Que pouvez-vous demander ?","Une formulation pour préparer la discussion."]].map(([n,title,text]) => <div key={n} className="flex gap-4 border-b border-[#17191d]/15 pb-4"><span className="font-mono text-xs text-[#e86a3a]">{n}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-[#17191d]/55">{text}</p></div></div>)}</div></div></section>
    <EndNote />
  </>;
}
