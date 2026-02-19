import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen pt-10 pb-24 text-black">
      <div className="max-w-5xl mx-auto px-4">
        
        <header className="mb-12">
          <Link href="/mon-compte" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 inline-block">
            ← Retour au compte
          </Link>
          <h1 className="text-[40px] font-[1000] tracking-tighter text-[#111111]">
            Mon Profil<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-sm mt-2">
            Gérez vos informations personnelles et la sécurité de votre compte.
          </p>
        </header>

        {/* Le composant de gestion de profil Clerk */}
        <div className="flex justify-center shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <UserProfile 
            routing="hash" // Utilise le hachage pour la navigation interne du composant
            appearance={{
              variables: {
                colorPrimary: '#2563eb', // Ton bleu RENW
                borderRadius: '1.5rem',
              },
              elements: {
                card: "shadow-none border-none w-full",
                navbar: "bg-[#F5F5F7] p-4",
                navbarMobileMenuButton: "text-blue-600",
                headerTitle: "text-2xl font-[1000] tracking-tighter",
                headerSubtitle: "text-gray-400 font-medium",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 rounded-full py-3 uppercase text-[10px] font-black tracking-widest",
              }
            }}
          />
        </div>

      </div>
    </main>
  );
}