"use client";

import { useReveal } from "@/lib/hooks/useReveal";

export default function CookiePolicyPage() {
  useReveal();

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Transparence
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Gestion des <br />
            <span className="serif-display text-white/30">cookies.</span>
          </h1>
          <p className="text-xl text-white/30 leading-relaxed">
            Nous utilisons les cookies pour améliorer votre expérience
            d&apos;analyse. Aucun cookie publicitaire tiers n&apos;est utilisé
            sans votre accord.
          </p>
        </header>

        <div className="space-y-16 reveal border-t border-white/5 pt-16">
          <section>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
              Cookies Essentiels
            </h2>
            <p className="text-white/40 leading-relaxed">
              Nécessaires au fonctionnement de l&apos;authentification et de la
              sécurité de votre session d&apos;analyse. Ils ne peuvent pas être
              désactivés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
              Cookies Analytiques
            </h2>
            <p className="text-white/40 leading-relaxed">
              Nous aident à comprendre comment vous utilisez la plateforme afin
              d&apos;optimiser les performances de nos algorithmes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
