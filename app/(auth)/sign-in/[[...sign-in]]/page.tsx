import { SignIn } from "@clerk/nextjs";
import { renwClerkTheme } from "@/styles/clerk-theme";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] py-20 px-4">
      
      {/* Logo pour rassurer le client */}
      <Link href="/" className="mb-10 group transition-all">
        <h2 className="text-[28px] font-[1000] tracking-tighter text-[#111111]">
          RENW<span className="text-blue-600 group-hover:text-black transition-colors">.</span>
        </h2>
      </Link>

      <SignIn 
        // On utilise ton thème centralisé pour la cohérence
        appearance={renwClerkTheme} 
        // Paramètres indispensables pour le routage dynamique
        path="/sign-in"
        signUpUrl="/sign-up"
        // Redirige vers l'étape de livraison après la connexion
        forceRedirectUrl="/checkout/shipping"
      />

      <div className="mt-12 flex items-center gap-6 opacity-30 italic">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">🔒 Sécurité SSL 256-bit</span>
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">🛡️ Confidentialité garantie</span>
      </div>
      
    </div>
  );
}