import Link from "next/link";
import { FileSearch, Home, Upload, ArrowRight, Shield } from "lucide-react";
import CustomButton from "@/components/ui/custom/CustomButton";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container relative z-10 px-6 max-w-4xl mx-auto text-center">
        {/* Abstract 404 Visual */}
        <div className="relative mb-12 inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-[100px] pointer-events-none" />
          <div className="relative text-[12rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/[0.05] to-transparent select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-border backdrop-blur-md flex items-center justify-center shadow-2xl animate-float">
              <FileSearch className="w-10 h-10 text-accent" />
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-16 animate-slide-up [animation-delay:0.2s]">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Page introuvable
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            La page que vous recherchez semble avoir été déplacée, supprimée ou
            n'a jamais existé.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-16 animate-slide-up [animation-delay:0.4s]">
          <Link href="/">
            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-border hover:border-accent/20 hover:bg-white/[0.04] transition-all text-left h-full">
              <div className="mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Home className="w-5 h-5 text-white/40 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                Accueil
              </h3>
              <p className="text-sm text-white/30">
                Retourner à la page principale
              </p>
            </div>
          </Link>

          <Link href="/upload">
            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-border hover:border-accent/20 hover:bg-white/[0.04] transition-all text-left h-full">
              <div className="mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-5 h-5 text-white/40 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                Nouvelle analyse
              </h3>
              <p className="text-sm text-white/30">
                Lancer une analyse de contrat
              </p>
            </div>
          </Link>
        </div>

        <div className="animate-slide-up [animation-delay:0.6s]">
          <Link href="/">
            <CustomButton
              variant="outline"
              className="px-8 border-border hover:bg-white/5 text-white/60 hover:text-white"
            >
              Retour en lieu sûr
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
