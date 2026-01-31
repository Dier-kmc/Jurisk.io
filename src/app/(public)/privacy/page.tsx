"use client";

import { useReveal } from "@/lib/hooks/useReveal";

export default function PrivacyPage() {
  useReveal();

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Légal
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Politique de <br />
            <span className="serif-display text-white/30">
              confidentialité.
            </span>
          </h1>
          <p className="text-xl text-white/30 leading-relaxed">
            Dernière mise à jour : 27 Janvier 2026. Chez Jurisk.io
            protection de vos données n&apos;est pas une option, c&apos;est
            notre fondation technologique.
          </p>
        </header>

        <div className="space-y-16 reveal">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              1. Collecte des données
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Nous collectons uniquement les informations strictement
              nécessaires à la fourniture de nos services d&apos;analyse. Cela
              inclut vos informations de compte et les documents que vous
              choisissez de nous soumettre pour analyse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              2. Chiffrement & Sécurité
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Tous les documents sont chiffrés au repos via AES-256 et en
              transit via TLS 1.3. Vos données ne sont jamais utilisées pour
              entraîner nos modèles d&apos;IA globaux sans votre consentement
              explicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
              3. Hébergement Souverain
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              Nos serveurs sont situés exclusivement au sein de l&apos;Union
              Européenne, garantissant une conformité totale avec le RGPD et les
              normes de protection des données les plus strictes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
