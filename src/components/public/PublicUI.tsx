import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  FileText,
  ScanLine,
  Shield,
  TriangleAlert,
} from "lucide-react";

export function Intro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">{eyebrow}</p>
      <h1 className="mt-5 font-serif text-5xl leading-[.94] tracking-[-.06em] sm:text-7xl">{title}</h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-[#17191d]/60">{text}</p>
    </div>
  );
}

export function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-t border-[#17191d]/15 py-5 text-sm leading-6 text-[#17191d]/65">
      <span className="text-[#e86a3a]">→</span>{children}
    </div>
  );
}

export function ClauseMap() {
  return (
    <div className="contract-drift border border-[#17191d] bg-[#f8f7f2] shadow-[8px_8px_0_#2848c7]">
      <div className="flex items-center justify-between border-b border-[#17191d]/15 px-5 py-4 text-xs">
        <span className="font-mono">contrat_prestation.pdf</span>
        <span className="font-bold tracking-[.18em] text-[#e86a3a]">JURISK</span>
        <span className="font-mono text-[#17191d]/45">001</span>
      </div>
      <div className="grid md:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-5 p-6 text-sm leading-7 text-[#17191d]/70 sm:p-8">
          <p className="font-semibold text-[#17191d]">Article 4 — Responsabilité</p>
          <p>Le Prestataire s’engage à fournir les services définis à l’article 2 dans un délai indicatif de trente jours.</p>
          <p className="border-l-4 border-[#e86a3a] bg-[#e86a3a]/10 px-4 py-3 text-[#17191d]">
            La responsabilité du Prestataire est limitée au montant payé au cours des trois derniers mois.
          </p>
          <p>Le Client peut résilier le présent accord avec un préavis de trente jours.</p>
        </div>
        <aside className="border-t border-[#17191d]/15 bg-[#e9d98a]/45 p-6 md:border-l md:border-t-0 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e86a3a]">À examiner</p>
          <p className="mt-6 font-serif text-6xl leading-none text-[#2848c7]">62<span className="text-2xl text-[#17191d]/35">/100</span></p>
          <p className="mt-5 text-sm leading-6 text-[#17191d]/65">La limitation peut être insuffisante si la valeur du contrat dépasse trois mois de facturation.</p>
          <Link href="/report" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#2848c7]">Voir le rapport <ArrowUpRight size={14} /></Link>
        </aside>
      </div>
    </div>
  );
}

export function PublicButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`public-blue-button inline-flex items-center gap-2 bg-[#2848c7] px-5 py-3 text-sm font-bold text-white ${className}`}>
      {children}
    </Link>
  );
}

export function Feature({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#17191d]/25 pt-5">
      <Icon size={22} strokeWidth={1.6} className="text-[#2848c7]" />
      <h3 className="mt-6 text-xl font-semibold tracking-[-.03em]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#17191d]/60">{children}</p>
    </div>
  );
}

export function EndNote() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
      <div className="bg-[#e9d98a] p-7 sm:p-12">
        <p className="max-w-2xl font-serif text-4xl leading-none tracking-[-.05em] sm:text-6xl">Votre prochain contrat mérite mieux qu’un survol.</p>
        <PublicButton href="/login?callbackUrl=%2Fupload" className="mt-8">Commencer une analyse <ArrowUpRight size={16} /></PublicButton>
      </div>
    </section>
  );
}

export const benefits = [
  { icon: ScanLine, title: "Texte sous la loupe", text: "Les extraits importants restent visibles, dans leur contexte, au lieu de disparaître dans un résumé." },
  { icon: TriangleAlert, title: "Risques hiérarchisés", text: "Les points sensibles sont séparés des ambiguïtés et des protections déjà équilibrées." },
  { icon: Shield, title: "Décision à votre rythme", text: "Vous repartez avec des questions et des formulations pour préparer la suite." },
];

export function Checks({ items }: { items: string[] }) {
  return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm text-[#17191d]/65"><Check size={16} className="mt-0.5 shrink-0 text-[#2848c7]" />{item}</li>)}</ul>;
}

export { FileText };
