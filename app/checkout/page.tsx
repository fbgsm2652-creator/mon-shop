"use client";

import Link from "next/link";

export default function CheckoutEntryPage() {
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <div style={siteFont} className="bg-white min-h-screen pt-20 pb-24 text-[#111111]">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-[24px] font-bold uppercase tracking-widest">Finaliser ma commande</h1>
          <p className="text-gray-400 text-[13px] mt-2">Choisissez votre mode de passage en caisse</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* OPTION 1 : COMMANDE EXPRESS */}
          <div className="p-10 bg-[#F5F5F7] rounded-[3rem] border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-[18px] font-bold uppercase tracking-tight mb-4">Commande Express</h2>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-8">
                Pas besoin de compte. Vous pourrez en créer un à la fin pour suivre votre colis.
              </p>
            </div>
            <Link href="/checkout/shipping" className="w-full bg-[#111111] text-white py-5 rounded-full font-bold uppercase tracking-widest text-[11px] text-center hover:bg-blue-600 transition-all">
              Continuer en invité
            </Link>
          </div>

          {/* OPTION 2 : CONNEXION / CRÉATION (LIÉ À CLERK) */}
          <div className="p-10 bg-white border border-gray-100 rounded-[3rem] flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-[18px] font-bold uppercase tracking-tight mb-4">Compte Client</h2>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-8">
                Connectez-vous pour utiliser vos adresses enregistrées et cumuler vos avantages RENW.
              </p>
            </div>
            <div className="space-y-4">
                {/* MODIFIÉ : Pointe vers ta nouvelle page de connexion */}
                <Link href="/sign-in" className="w-full block bg-blue-600 text-white py-5 rounded-full font-bold uppercase tracking-widest text-[11px] text-center hover:bg-blue-700 transition-all">
                    Se connecter
                </Link>
                {/* MODIFIÉ : Pointe vers ta nouvelle page d'inscription */}
                <Link href="/sign-up" className="w-full block border border-gray-200 text-[#111111] py-5 rounded-full font-bold uppercase tracking-widest text-[11px] text-center hover:bg-gray-50 transition-all">
                    Créer un compte
                </Link>
            </div>
          </div>

        </div>

        {/* RAPPEL SÉCURITÉ */}
        <div className="mt-20 flex items-center justify-center gap-8 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">🔒 Paiement Sécurisé</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">🛡️ Garantie 12 mois</span>
        </div>
      </div>
    </div>
  );
}