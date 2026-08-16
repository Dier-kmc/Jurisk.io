"use client";

import { useReveal } from "@/lib/hooks/useReveal";

export default function TermsPage() {
  useReveal();

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Accord
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Conditions <br />
            <span className="text-white/30">
              d&apos;utilisation.
            </span>
          </h1>
          <p className="text-xl text-white/30 leading-relaxed">
            En accédant à Jurisk.io, vous acceptez les termes régissant
            l&apos;usage de notre plateforme d&apos;analyse augmentée.
          </p>
        </header>

        <div className="space-y-16 reveal">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              1. Nature du Service
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Jurisk.io fournit un outil d&apos;aide à l&apos;analyse
              juridique. Nos résultats sont fournis à titre indicatif et ne
              remplacent en aucun cas l&apos;avis d&apos;un avocat qualifié.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              2. Propriété Intellectuelle
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Vous conservez l&apos;intégralité des droits sur les documents
              soumis. Jurisk.io détient les droits sur sa technologie
              d&apos;analyse et son interface utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              3. Usage Acceptable
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Il est interdit d&apos;utiliser Jurisk.io pour traiter des
              documents illégaux ou pour tenter de porter atteinte à
              l&apos;intégrité de nos systèmes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
