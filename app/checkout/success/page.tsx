"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { client } from "@/sanity/lib/client";

export default function SuccessPage() {
  const cart = useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  useEffect(() => {
    const validatePaymentInSanity = async () => {
      const orderId = localStorage.getItem("current-order-id");
      const savedInfo = localStorage.getItem("customer-info");

      if (savedInfo) {
        const { email } = JSON.parse(savedInfo);
        setCustomerEmail(email);
      }

      if (orderId) {
        try {
          // On passe la commande au vert dans Sanity
          await client.patch(orderId)
            .set({ 
              isPaid: true, 
              status: 'processing' 
            })
            .commit();
            
          cart.removeAll(); 
          localStorage.removeItem("current-order-id");
        } catch (err) {
          console.error("Erreur validation paiement:", err);
        }
      }
    };

    validatePaymentInSanity();
  }, [cart]);

  return (
    <div style={siteFont} className="bg-[#FBFBFD] min-h-screen pt-20 pb-24 text-[#111111] antialiased">
      <div className="max-w-3xl mx-auto px-4 text-center">
        
        <div className="mb-10 inline-flex items-center justify-center h-20 w-20 bg-green-50 rounded-full border border-green-100 animate-bounce">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-[26px] font-black uppercase tracking-tighter mb-4">
          Paiement Confirmé<span className="text-blue-600">.</span>
        </h1>
        
        <p className="text-gray-500 text-[14px] leading-relaxed max-w-md mx-auto mb-12">
          Votre commande a été validée avec succès. Vous recevrez un e-mail de confirmation sur <span className="font-bold">{customerEmail}</span>.
        </p>

        {/* SECTION CRÉATION DE COMPTE POST-ACHAT */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-12">
          <h2 className="text-[16px] font-bold uppercase tracking-tight mb-4 text-blue-600">Suivre mon colis & Garantie</h2>
          <p className="text-gray-400 text-[13px] mb-8 leading-relaxed px-6">
            Créez votre compte maintenant pour suivre l'état de votre livraison et activer votre **garantie de 12 mois** sur vos produits RENW.
          </p>
          
          <div className="max-w-xs mx-auto">
            {/* On envoie vers sign-up avec l'email déjà rempli */}
            <Link 
              href={`/sign-up?email_address=${encodeURIComponent(customerEmail)}`}
              className="block w-full bg-[#111111] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
            >
              Activer mon compte
            </Link>
            <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Simple & Rapide</p>
          </div>
        </div>

        <Link href="/" className="inline-block text-[#111111] font-bold uppercase text-[10px] tracking-[0.3em] border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors">
            Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
}