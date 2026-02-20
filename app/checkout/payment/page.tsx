"use client";

import useCart from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";

export default function PaymentPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);

  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  useEffect(() => {
    setIsMounted(true);
    const savedCustomer = localStorage.getItem("customer-info");
    if (savedCustomer) {
      const data = JSON.parse(savedCustomer);
      setCustomerData(data);
    }
  }, []);

  // --- CALCUL SÉCURISÉ EN DIRECT ---
  // 1. Calcul du sous-total des articles (en prenant en compte la quantité si elle existe)
  const itemsSubtotal = cart.items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  // 2. Récupération sécurisée du prix de la livraison (par défaut 0 si non trouvé)
  const shippingPrice = customerData?.shippingPrice ? Number(customerData.shippingPrice) : 0;

  // 3. Le VRAI total final
  const totalFinal = itemsSubtotal + shippingPrice;

  if (!isMounted) return null;

  const handleZenPayment = async () => {
    if (!customerData || totalFinal <= 0) {
      alert("Informations de commande incomplètes ou panier vide. Veuillez recommencer l'étape de livraison.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/zen-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          total: totalFinal, // On envoie le montant calculé et vérifié
          customer: customerData
        })
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Erreur ZEN : " + (data.error || "Impossible d'initier la transaction"));
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      alert("Une erreur technique est survenue lors de la liaison avec ZEN.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={siteFont} className="bg-white min-h-screen text-[#111111]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* COLONNE GAUCHE : CHOIX PAIEMENT (50%) */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full text-center">
            <div className="mb-10">
               <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Paiement 100% Sécurisé</span>
               </div>
               <h1 className="text-[26px] font-black uppercase tracking-tighter">
                  Finaliser le règlement<span className="text-blue-600">.</span>
               </h1>
            </div>

            <div className="bg-[#F5F5F7] p-8 rounded-[2.5rem] mb-10 border border-gray-100">
               <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Montant total à régler</p>
               <p className="text-5xl font-black text-blue-600 tracking-tighter">{totalFinal.toFixed(2)}€</p>
               <p className="text-[11px] text-gray-500 mt-4 font-medium italic">
                  Livraison {customerData?.shippingName || "Standard"} incluse ({shippingPrice.toFixed(2)}€)
               </p>
            </div>

            <div className="space-y-4">
               <button 
                  onClick={handleZenPayment}
                  disabled={loading || totalFinal <= 0}
                  className={`w-full bg-[#111111] text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] transition-all shadow-xl active:scale-95 ${loading || totalFinal <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
               >
                  {loading ? "Connexion à ZEN.com..." : "Confirmer et Payer"}
               </button>
               
               <div className="grid grid-cols-4 gap-4 pt-6 grayscale opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 mx-auto" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 mx-auto" alt="Mastercard" />
                  <span className="text-[10px] font-black text-center">APPLE PAY</span>
                  <span className="text-[10px] font-black text-center">G-PAY</span>
               </div>
            </div>

            <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
               Votre commande sera expédiée en <span className="text-[#111111] font-bold">{customerData?.country || "France"}</span><br/>
               via {customerData?.shippingName || "votre transporteur"} dès validation du paiement.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : RÉCAPITULATIF (50%) */}
        <div className="w-full lg:w-1/2 bg-[#F5F5F7] p-8 md:p-16 lg:p-24 border-l border-gray-100 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-10 pb-4 border-b border-gray-200">
               Récapitulatif de commande
            </h2>
            
            <div className="space-y-6 mb-10">
              {cart.items.map((item) => (
                <div key={item._id} className="flex gap-6 items-center">
                  <div className="h-16 w-16 bg-white rounded-xl p-2 border border-gray-100 shrink-0">
                    {/* Sécurité : Vérifie que l'image existe avant d'essayer de l'afficher */}
                    {item.images && item.images[0] ? (
                      <img src={urlFor(item.images[0]).url()} className="h-full w-full object-contain" alt={item.name} />
                    ) : (
                      <div className="h-full w-full bg-gray-100 rounded-md"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold uppercase truncate">{item.name}</p>
                    {/* Affichage conditionnel de la capacité et du grade si ce sont des téléphones */}
                    {(item.capacity || item.grade) && (
                        <p className="text-[9px] text-blue-600 font-bold uppercase">{item.capacity} {item.capacity && item.grade && '|'} {item.grade}</p>
                    )}
                    
                    {/* CORRECTION TYPESCRIPT ICI */}
                    {(item.quantity || 1) > 1 && (
                        <p className="text-[10px] text-gray-500 font-medium">Qté: {item.quantity || 1}</p>
                    )}

                  </div>
                  <p className="text-[14px] font-bold">{(Number(item.price) * (item.quantity || 1)).toFixed(2)}€</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
               <div className="flex justify-between text-[13px] text-gray-500">
                  <span>Articles</span>
                  <span>{itemsSubtotal.toFixed(2)}€</span>
               </div>
               <div className="flex justify-between text-[13px] text-gray-500">
                  <span>Livraison ({customerData?.shippingName || "Standard"})</span>
                  <span className="text-blue-600 font-bold">{shippingPrice === 0 ? "OFFERTE" : `${shippingPrice.toFixed(2)}€`}</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}