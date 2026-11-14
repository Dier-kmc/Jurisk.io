"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, FilePlus2, LoaderCircle, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/lib/hooks/useCredits";

type Context = { jurisdiction: string; contractType: string; representedParty: string; objective: string };

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { credits, refreshCredits } = useCredits();
  const [context, setContext] = useState<Context>({ jurisdiction: "FR", contractType: "commercial_general", representedParty: "client", objective: "renegotiate" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const chooseFile = (candidate?: File) => {
    if (!candidate) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"];
    if (!allowed.includes(candidate.type)) return setMessage({ type: "error", text: "Choisissez un PDF, DOCX, DOC ou TXT." });
    if (candidate.size > 50 * 1024 * 1024) return setMessage({ type: "error", text: "Le fichier doit faire moins de 50 Mo." });
    setFile(candidate);
    setMessage(null);
  };

  async function analyze() {
    if (!file) return setMessage({ type: "error", text: "Ajoutez un contrat avant de lancer l’analyse." });
    if (credits === 0) return setMessage({ type: "error", text: "Vous n’avez plus de crédit disponible." });
    setBusy(true); setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(context).forEach(([key, value]) => formData.append(key, value));
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Impossible de lancer l’analyse.");
      await refreshCredits();
      window.dispatchEvent(new Event("jurisk:credits-updated"));
      setMessage({ type: "success", text: "Contrat reçu. Préparation de votre lecture…" });
      router.push(`/result/${data.contractId}`);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally { setBusy(false); }
  }

  const updateContext = (key: keyof Context, value: string) => setContext((current) => ({ ...current, [key]: value }));

  return <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-20">
    <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
      <section><p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">Nouvelle analyse</p><h1 className="mt-5 max-w-xl font-serif text-6xl leading-[.9] tracking-[-.07em] sm:text-8xl">Lire avant de <em className="text-[#2848c7]">décider.</em></h1><p className="mt-8 max-w-lg text-lg leading-8 text-[#17191d]/60">Donnez à Jurisk le contexte de votre contrat. L’analyse organisera les obligations, les priorités et les leviers de négociation pour votre situation.</p><div className="mt-10 flex items-center gap-3 border-t border-[#17191d]/20 pt-5 text-sm"><FilePlus2 size={18} className="text-[#2848c7]" /><span>{credits === null ? "Crédits disponibles : …" : `${credits} crédit${credits === 1 ? "" : "s"} disponible${credits === 1 ? "" : "s"}`}</span></div></section>
      <section className="border border-[#17191d] bg-[#fffdf8] shadow-[8px_8px_0_#2848c7]">
        <div className="border-b border-[#17191d]/15 px-6 py-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2848c7]">01 / Le document</p><h2 className="mt-3 font-serif text-3xl tracking-[-.04em]">Déposez votre contrat</h2></div>
        <div className="p-6 sm:p-8"><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} className="flex min-h-64 w-full flex-col items-center justify-center border border-dashed border-[#17191d]/35 bg-[#f0eee8] px-6 text-center hover:border-[#2848c7]"><UploadCloud size={34} strokeWidth={1.4} className="text-[#2848c7]" /><p className="mt-6 font-serif text-2xl">{file ? file.name : "Déposez le document ici"}</p><p className="mt-3 text-sm text-[#17191d]/50">PDF, DOCX, DOC ou TXT · 50 Mo maximum</p><input ref={inputRef} type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={(event) => chooseFile(event.target.files?.[0])} /></button>
          <div className="mt-8 border-t border-[#17191d]/15 pt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2848c7]">02 / Votre situation</p><p className="mt-2 text-sm text-[#17191d]/55">Ces choix déterminent les priorités de lecture.</p><div className="mt-6 grid gap-5 sm:grid-cols-2">{[["jurisdiction", "Juridiction", [["FR", "France"], ["BE", "Belgique"], ["CA", "Canada"], ["OHADA", "Espace OHADA"]]], ["contractType", "Famille de contrat", [["commercial_general", "Contrat commercial"], ["employment", "Contrat de travail"]]], ["representedParty", "Votre partie", [["client", "Client / employeur"], ["provider", "Prestataire / salarié"], ["party_a", "Partie A"], ["party_b", "Partie B"]]], ["objective", "Votre objectif", [["renegotiate", "Préparer une négociation"], ["sign", "Décider avant signature"], ["renew", "Préparer un renouvellement"], ["review", "Comprendre le contrat"]]]].map(([key, label, options]) => <label key={key as string} className="text-xs font-semibold">{label as string}<select value={context[key as keyof Context]} onChange={(event) => updateContext(key as keyof Context, event.target.value)} className="mt-2 w-full border border-[#17191d]/20 bg-transparent px-3 py-3 text-sm outline-none focus:border-[#2848c7]">{(options as string[][]).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>)}</div></div>
          {message && <div className={`mt-6 flex gap-3 border px-4 py-3 text-sm ${message.type === "error" ? "border-[#e86a3a]/40 bg-[#e86a3a]/10 text-[#9b351e]" : "border-[#2848c7]/30 bg-[#2848c7]/10 text-[#2848c7]"}`}>{message.type === "error" ? <AlertTriangle size={17} /> : <Check size={17} />}{message.text}</div>}
          <button type="button" onClick={analyze} disabled={busy || !file} className="mt-7 flex w-full items-center justify-center gap-2 bg-[#2848c7] px-5 py-4 text-sm font-bold text-white shadow-[4px_4px_0_#17191d] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#17191d]/20 disabled:text-[#17191d]/40 disabled:shadow-none">{busy ? <><LoaderCircle size={17} className="animate-spin" />Préparation…</> : <>Lancer la lecture <ArrowUpRight size={17} /></>}</button>
        </div>
      </section>
    </div>
  </div>;
}
