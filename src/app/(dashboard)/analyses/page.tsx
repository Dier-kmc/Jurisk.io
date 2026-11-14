"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, FileText, LoaderCircle, Plus, TriangleAlert } from "lucide-react";

type AnalysisItem = { id: string; fileName: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"; createdAt: string; updatedAt: string; summary?: string; riskScore?: number | null; fileType?: string; analysisTime?: string | null };

export default function AnalysesPage() {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analysis?limit=50&page=1", { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || "Impossible de charger vos analyses."); setItems(data.data.contracts); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Impossible de charger vos analyses."))
      .finally(() => setLoading(false));
  }, []);

  return <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-20">
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#17191d]/20 pb-8"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Espace de travail</p><h1 className="mt-5 font-serif text-6xl leading-[.9] tracking-[-.07em]">Mes analyses.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[#17191d]/60">Retrouvez vos contrats, leur état de lecture et les rapports déjà générés.</p></div><Link href="/upload" className="inline-flex items-center gap-2 bg-[#2848c7] px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#17191d]"><Plus size={17} />Nouvelle analyse</Link></div>
    {loading && <div className="flex items-center gap-3 py-16 text-sm text-[#17191d]/55"><LoaderCircle size={18} className="animate-spin text-[#2848c7]" />Chargement de vos contrats…</div>}
    {error && <div className="mt-10 flex gap-3 border border-[#e86a3a]/35 bg-[#e86a3a]/10 p-5 text-sm text-[#9b351e]"><TriangleAlert size={18} />{error}</div>}
    {!loading && !error && items.length === 0 && <div className="mt-10 border border-dashed border-[#17191d]/25 bg-[#fffdf8] p-10"><FileText className="text-[#2848c7]" size={24} /><h2 className="mt-6 font-serif text-3xl">Votre historique est encore vide.</h2><p className="mt-3 text-sm text-[#17191d]/55">Lancez une première lecture pour retrouver ici vos contrats et leurs priorités.</p><Link href="/upload" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#2848c7]">Analyser un contrat <ArrowUpRight size={16} /></Link></div>}
    <div className="mt-10 space-y-4">{items.map((item) => <Link key={item.id} href={`/result/${item.id}`} className="group block border border-[#17191d]/15 bg-[#fffdf8] p-5 transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_#2848c7] sm:p-7"><div className="flex flex-wrap items-center justify-between gap-5"><div className="flex items-start gap-4"><FileText className="mt-1 text-[#2848c7]" size={22} /><div><h2 className="text-xl font-semibold tracking-[-.03em]">{item.fileName}</h2><p className="mt-2 text-xs text-[#17191d]/50">{formatDate(item.createdAt)}{item.fileType ? ` · ${item.fileType}` : ""}{item.analysisTime ? ` · ${item.analysisTime}` : ""}</p></div></div><Status status={item.status} /></div>{item.summary && <p className="mt-6 max-w-3xl border-t border-[#17191d]/10 pt-5 text-sm leading-6 text-[#17191d]/60">{item.summary}</p>}<span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#2848c7]">Ouvrir le rapport <ArrowUpRight size={14} /></span></Link>)}</div>
  </div>;
}

function Status({ status }: { status: AnalysisItem["status"] }) { const labels = { PENDING: "En attente", PROCESSING: "En cours", COMPLETED: "Terminé", FAILED: "Échec" }; return <span className={`border px-3 py-1 text-xs font-bold ${status === "COMPLETED" ? "border-[#2848c7]/30 bg-[#2848c7]/10 text-[#2848c7]" : status === "FAILED" ? "border-[#e86a3a]/30 bg-[#e86a3a]/10 text-[#9b351e]" : "border-[#17191d]/20 text-[#17191d]/55"}`}><Clock3 size={13} className="mr-1 inline" />{labels[status]}</span>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value)); }
