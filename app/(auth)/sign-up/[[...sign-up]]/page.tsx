import { SignUp } from "@clerk/nextjs";
import { renwClerkTheme } from "@/styles/clerk-theme";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] py-20 px-4">
      
      {/* Logo RENW */}
      <Link href="/" className="mb-10 group transition-all">
        <h2 className="text-[28px] font-[1000] tracking-tighter text-[#111111]">
          RENW<span className="text-blue-600 group-hover:text-black transition-colors">.</span>
        </h2>
      </Link>

      <SignUp 
        appearance={renwClerkTheme} 
        // Paramètres indispensables
        path="/sign-up"
        signInUrl="/sign-in"
        // Redirige vers l'étape de livraison après inscription
        forceRedirectUrl="/checkout/shipping"
      />

      <div className="mt-12 flex items-center gap-6 opacity-30">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">🤝 Membre Certifié RENW</span>
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">⚡ Inscription Rapide</span>
      </div>
      
    </div>
  );
}