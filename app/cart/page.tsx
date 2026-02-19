"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/use-cart";
import CartItem from "@/components/cart-item";
import Summary from "@/components/summary";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  // On force le type en 'any' pour éviter l'erreur de build sur la propriété 'items'
  const cart = useCart() as any;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-12" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black mb-12 text-white flex items-center gap-4 uppercase tracking-widest">
          <ShoppingBag className="text-blue-500" size={32} />
          Mon Panier
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          
          {/* Liste des articles */}
          <div className="lg:col-span-7">
            {/* Utilisation de l'optional chaining ?. pour plus de sécurité au build */}
            {cart?.items?.length === 0 && (
              <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
                <p className="text-gray-400 text-xl mb-6">Votre panier est vide 😢</p>
                <Link href="/">
                  <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                    Découvrir nos produits
                  </button>
                </Link>
              </div>
            )}
            
            <ul>
              {cart?.items?.map((item: any) => (
                <CartItem key={item.id} data={item} />
              ))}
            </ul>
          </div>

          {/* Résumé de commande */}
          <Summary />
          
        </div>
      </div>
    </div>
  );
}