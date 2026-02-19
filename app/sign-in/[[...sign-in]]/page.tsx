import { SignIn } from "@clerk/nextjs";
import { renwClerkTheme } from "@/styles/clerk-theme";
import Link from "next/link";
import { Metadata } from "next";

// --- AJOUT SEO : On ne veut pas indexer la page de connexion pour protéger le budget de crawl ---
export const metadata: Metadata = {
  title: "Connexion | RENW",
  description: "Accédez à votre compte client RENW pour suivre vos commandes et gérer vos adresses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] py-20 px-4" role="main">
      
      {/* 1. BRANDING : Rappel visuel pour la réassurance */}
      <Link href="/" className="mb-10 group transition-all" aria-label="Retour à l'accueil RENW">
        <h2 className="text-[28px] font-[1000] tracking-tighter text-[#111111]">
          RENW<span className="text-blue-600 group-hover:text-black transition-colors">.</span>
        </h2>
      </Link>

      {/* 2. FORMULAIRE CLERK : Avec ton thème personnalisé */}
      <section className="shadow-2xl rounded-3xl overflow-hidden">
        <SignIn 
          appearance={renwClerkTheme} 
        />
      </section>

      {/* 3. REASSURANCE : Footer de page de connexion */}
      <footer className="mt-12 flex flex-col md:flex-row items-center gap-6 opacity-30 text-center">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protection des données</span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Garantie Apple-Style</span>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} RENW Inc.</p>
      </footer>
      
    </main>
  );
}