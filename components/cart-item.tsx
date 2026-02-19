"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import useCart from "@/hooks/use-cart";

interface CartItemProps {
  data: {
    _id: string; 
    name: string;
    price: number;
    images?: any[]; // On s'aligne sur la structure Sanity
    image?: string; // Fallback
    quantity: number;
  };
}

export default function CartItem({ data }: CartItemProps) {
  const cart = useCart();

  // Utilisation de la fonction propre de notre store synchronisé
  const onRemove = () => {
    cart.removeItem(data._id);
  };

  return (
    <li className="flex py-8 border-b border-gray-100 last:border-0 group animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* 1. IMAGE PRODUIT */}
      <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden sm:h-36 sm:w-36 bg-[#F5F5F7] border border-gray-50 shrink-0">
        <Image
          fill
          src={data.image || (data.images && data.images[0]) || ""}
          alt={data.name}
          className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* 2. INFOS & ACTIONS */}
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-8">
        
        {/* BOUTON SUPPRIMER */}
        <div className="absolute z-10 right-0 top-0">
          <button 
            onClick={onRemove}
            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
            aria-label="Supprimer l'article"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        {/* TITRE & BADGE */}
        <div className="pr-10">
          <h3 className="text-[15px] sm:text-xl font-[1000] text-[#111111] uppercase tracking-tighter leading-tight">
            {data.name}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] italic">
              Expertise RENW
            </p>
            <span className="h-1 w-1 rounded-full bg-gray-200"></span>
            <p className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em]">
              En stock
            </p>
          </div>
        </div>
        
        {/* PRIX & QUANTITÉ */}
        <div className="flex items-end justify-between">
          <div className="flex items-center bg-[#F5F5F7] rounded-full p-1 border border-gray-100">
             {/* Note: Tu pourras brancher updateQuantity ici plus tard */}
             <span className="px-4 text-[11px] font-black text-[#111111]">
               QTY: {data.quantity || 1}
             </span>
          </div>
          
          <p className="text-xl sm:text-2xl font-[1000] text-[#111111] italic tracking-tighter">
            {data.price}€
          </p>
        </div>
      </div>
    </li>
  );
}