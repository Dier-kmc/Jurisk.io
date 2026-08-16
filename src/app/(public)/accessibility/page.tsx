"use client";

import { useReveal } from "@/lib/hooks/useReveal";

export default function AccessibilityPage() {
  useReveal();

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Engagement
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Accessibilité numérique.
          </h1>
          <p className="text-xl text-white/30 leading-relaxed">
            Jurisk.io s&apos;engage à rendre sa plateforme accessible au
            plus grand nombre, conformément au RGAA.
          </p>
        </header>

        <div className="space-y-16 reveal border-t border-border pt-16">
          <section>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
              État de conformité
            </h2>
            <p className="text-white/40 leading-relaxed">
              Nous travaillons continuellement à l&apos;amélioration de
              l&apos;expérience utilisateur pour tous, en suivant les directives
              WCAG 2.1 niveau AA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
              Support
            </h2>
            <p className="text-white/40 leading-relaxed">
              Si vous rencontrez des difficultés d&apos;accès, contactez notre
              équipe à support@Jurisk.io.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
