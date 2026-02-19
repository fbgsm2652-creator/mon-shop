"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useCart from "@/hooks/use-cart";

export default function Summary() {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  // Calcul du prix avec typage correct et devise Euro
  const totalPrice = items.reduce((total: number, item: any) => {
    const price = Number(item.price) || 0;
    return total + price;
  }, 0);

  useEffect(() => {
    if (searchParams.get("success")) {
      removeAll();
    }
  }, [searchParams, removeAll]);

  return (
    <div className="mt-16 rounded-[32px] bg-[#F5F5F7] px-6 py-8 lg:col-span-5 lg:mt-0 lg:p-10 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-[1000] uppercase tracking-tighter italic text-[#111111]">
        Résumé de la commande
      </h2>
      
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#A1A1A5]">
            Total TTC
          </div>
          <div className="text-2xl font-[1000] text-[#111111] tracking-tighter">
            {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
        </div>
      </div>

      <button 
        disabled={items.length === 0}
        className="w-full mt-10 bg-[#111111] text-white rounded-full py-5 font-bold uppercase tracking-[0.15em] text-[13px] hover:bg-blue-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xl active:scale-[0.98]"
      >
        Passer au paiement
      </button>

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
          Livraison sécurisée • France Métropolitaine
        </p>
        <div className="flex justify-center gap-4 opacity-30 grayscale">
          {/* Tu peux ajouter des icônes Visa / Mastercard / Paypal ici */}
          <span className="text-xs font-bold italic">VISA</span>
          <span className="text-xs font-bold italic">MASTERCARD</span>
          <span className="text-xs font-bold italic">PAYPAL</span>
        </div>
      </div>
    </div>
  );
}