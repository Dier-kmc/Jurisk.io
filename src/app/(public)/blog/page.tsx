"use client";

import { useReveal } from "@/lib/hooks/useReveal";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  useReveal();

  const posts = [
    {
      title: "L'IA et l'avenir de la conformité juridique",
      excerpt:
        "Comment les nouveaux modèles de langage transforment la façon dont les cabinets gèrent les risques.",
      date: "24 Janv 2026",
      author: "Emma Roussel",
      category: "Innovation",
    },
    {
      title: "5 clauses abusives à surveiller en 2026",
      excerpt:
        "Une analyse détaillée des tendances contractuelles dans le secteur de la tech européenne.",
      date: "18 Janv 2026",
      author: "Marc Lefebvre",
      category: "Analyse",
    },
    {
      title: "Le RGPD à l'ère de l'intelligence artificielle",
      excerpt:
        "Assurer la souveraineté des données tout en exploitant la puissance du calcul distribué.",
      date: "12 Janv 2026",
      author: "Sophie Chen",
      category: "Légal",
    },
  ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 px-6">
        <header className="max-w-4xl mb-32 animate-slide-up">
          <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Le Journal
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Perspectives <br />
            <span className="text-white/30">& réflexions.</span>
          </h1>
          <p className="max-w-xl text-xl text-white/30 leading-relaxed">
            Analyses juridiques approfondies, actualités de l&apos;IA et visions
            sur l&apos;avenir du droit.
          </p>
        </header>

        <div className="space-y-40 reveal">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group relative flex flex-col md:flex-row gap-16 items-start"
            >
              <div className="md:w-1/3">
                <div className="aspect-[4/3] bg-white/[0.02] border border-border rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <span className="text-white/5 font-black text-8xl italic uppercase select-none">
                      {post.category.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center gap-6 mb-8 text-[10px] font-black tracking-widest uppercase text-white/20">
                  <span className="text-accent">{post.category}</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" /> {post.author}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 group-hover:text-accent transition-colors tracking-tight">
                  {post.title}
                </h2>
                <p className="text-xl text-white/30 leading-relaxed mb-10 max-w-2xl">
                  {post.excerpt}
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-4 text-white font-bold group/btn"
                >
                  Lire l&apos;article
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
