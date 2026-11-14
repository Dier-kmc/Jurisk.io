"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackUrl = params.get("callbackUrl")?.startsWith("/") ? params.get("callbackUrl")! : "/upload";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Impossible de créer le compte.");
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Email ou mot de passe incorrect.");
      router.push(callbackUrl);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full max-w-4xl overflow-hidden border border-[#17191d]/15 bg-[#fffdf8] lg:grid-cols-[.75fr_1.25fr]">
      <div className="hidden bg-[#2848c7] p-10 text-white lg:block">
        <span className="flex h-10 w-10 items-center justify-center bg-[#e9d98a] font-bold text-[#17211b]">J</span>
        <h2 className="mt-20 font-serif text-4xl leading-tight">{mode === "login" ? "Reprenez votre lecture là où vous l’avez laissée." : "Trois crédits pour regarder votre contrat autrement."}</h2>
        <p className="mt-6 text-sm leading-6 text-white/70">Les résultats relient chaque signal au texte qui le justifie.</p>
      </div>
      <div className="p-6 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e86a3a]">{mode === "login" ? "Se connecter" : "Créer un compte"}</p>
        <h1 className="mt-5 font-serif text-4xl leading-none">{mode === "login" ? "Retour à votre espace." : "Commencer l’analyse."}</h1>
        <button type="button" onClick={() => signIn("google", { callbackUrl })} className="mt-8 w-full border border-[#17191d]/20 px-4 py-3 text-sm font-semibold hover:border-[#2848c7]">Continuer avec Google</button>
        <div className="my-6 flex items-center gap-3 text-xs text-[#17191d]/40"><span className="h-px flex-1 bg-[#17191d]/10" />ou par email<span className="h-px flex-1 bg-[#17191d]/10" /></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <Field label="Nom" value={name} onChange={setName} required minLength={2} />}
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <PasswordField label="Mot de passe" value={password} onChange={setPassword} showPassword={showPassword} onToggle={() => setShowPassword((visible) => !visible)} required minLength={mode === "register" ? 8 : 1} />
          {error && <p role="alert" className="border border-[#e86a3a]/30 bg-[#e86a3a]/10 px-3 py-2 text-sm text-[#9b351e]">{error}</p>}
          <button disabled={loading} className="w-full bg-[#2848c7] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#203aa3] disabled:opacity-50">{loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-[#17191d]/50">{mode === "login" ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}<Link href={mode === "login" ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#2848c7]">{mode === "login" ? "Créer un compte" : "Se connecter"}</Link></p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <label className="block text-sm font-medium text-[#17191d]/70">{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border border-[#17191d]/20 bg-transparent px-3 py-3 outline-none focus:border-[#2848c7]" /></label>;
}

function PasswordField({ label, value, onChange, showPassword, onToggle, ...props }: { label: string; value: string; onChange: (value: string) => void; showPassword: boolean; onToggle: () => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">) {
  return <label className="block text-sm font-medium text-[#17191d]/70">{label}<span className="relative mt-2 block"><input {...props} type={showPassword ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-[#17191d]/20 bg-transparent px-3 py-3 pr-11 outline-none focus:border-[#2848c7]" /><button type="button" onClick={onToggle} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#17191d]/45 hover:text-[#2848c7]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>;
}
