import { SignUp } from "@clerk/nextjs";
import { renwClerkTheme } from "@/styles/clerk-theme";
import Link from "next/link";
import { Metadata } from "next";

// --- SEO : On interdit l'indexation pour booster la force des pages produits ---
export const metadata: Metadata = {
  title: "Créer un compte | RENW",
  description: "Rejoignez la communauté RENW. Profitez d'un suivi de commande simplifié et d'une expertise tech certifiée.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] py-20 px-4 text-[#111111]" role="main">
      
      {/* 1. BRANDING : Rappel visuel pour la confiance */}
      <Link href="/" className="mb-10 group transition-all" aria-label="Retour à l'accueil RENW">
        <h2 className="text-[28px] font-[1000] tracking-tighter">
          RENW<span className="text-blue-600 group-hover:text-black transition-colors">.</span>
        </h2>
      </Link>

      {/* 2. FORMULAIRE D'INSCRIPTION CLERK */}
      <section className="shadow-2xl rounded-3xl overflow-hidden">
        <SignUp 
          appearance={renwClerkTheme} 
        />
      </section>

      {/* 3. RÉASSURANCE & SIGNALS DE CONFIANCE */}
      <footer className="mt-12 flex flex-col md:flex-row items-center gap-6 opacity-30 text-center">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">🔒 Connexion Sécurisée</span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">🤝 Garantie RENW</span>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} RENW — Expertise & Technologie</p>
      </footer>
      
    </main>
  );
}