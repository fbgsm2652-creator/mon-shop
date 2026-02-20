"use client";

import useCart from "@/hooks/use-cart"; // <-- ON UTILISE LE BON HOOK
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const total = cart.items.reduce((acc, item) => acc + Number(item.price || 0), 0);

  const onRemove = (id: string) => {
    cart.removeItem(id);
  };

  const getImageUrl = (imageSource: any) => {
    if (!imageSource) return null;
    if (typeof imageSource === 'string' && imageSource.startsWith('http')) return imageSource;
    try {
      return urlFor(imageSource).url();
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="bg-white min-h-screen pt-12 pb-24 text-[#111111] antialiased" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* COLONNE GAUCHE */}
          <main className="flex-1 space-y-8 w-full">
            <header className="lg:pt-4 mb-10">
              <h1 className="text-[22px] md:text-[28px] font-medium tracking-tight italic">
                Mon panier<span className="text-blue-600">.</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-3">
                {cart.items.length} article(s) sélectionné(s)
              </p>
            </header>

            {cart.items.length === 0 ? (
              <div className="py-32 text-center bg-[#F5F5F7] rounded-[4rem] border border-gray-100">
                <p className="font-medium text-[14px] text-gray-400">Votre panier est vide</p>
                <Link href="/" className="inline-flex items-center gap-3 mt-8 text-blue-600 font-bold uppercase text-[11px] tracking-widest">
                    Retourner à la boutique <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <section className="space-y-6">
                {cart.items.map((item) => {
                  const imgUrl = getImageUrl(item.images?.[0]);
                  return (
                    <article key={item._id} className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row items-center">
                      <div className="h-32 w-32 shrink-0 bg-[#F5F5F7] rounded-[2rem] p-4 flex items-center justify-center">
                        {imgUrl ? (
                          <img src={imgUrl} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                        ) : (
                          <ShoppingBag className="text-gray-200" size={24} />
                        )}
                      </div>
                      <div className="mt-6 md:mt-0 md:ml-10 flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-[24px] font-normal text-gray-900 capitalize">{item.name}</h2>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-gray-50 border px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{item.color}</span>
                              <span className="bg-gray-50 border px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{item.capacity}</span>
                            </div>
                          </div>
                          <p className="text-[22px] font-medium text-gray-900">{item.price}€</p>
                        </div>
                        <button onClick={() => onRemove(item._id)} className="text-[13px] font-bold text-red-500 mt-8 flex items-center gap-2">
                          <Trash2 size={16} /> Retirer
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </main>

          {/* COLONNE DROITE */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
            <div className="p-10 bg-[#F5F5F7] rounded-[3rem] border border-gray-100">
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] mb-10 text-blue-600">Résumé</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="text-gray-900 font-medium">{total}€</span>
                </div>
                <div className="pt-8 mt-8 border-t flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase text-gray-400">Total</span>
                  <span className="text-[36px] font-medium text-gray-900">{total}€</span>
                </div>
                <Link href="/checkout" className={`w-full block py-6 rounded-full font-bold uppercase text-[11px] mt-10 text-center ${cart.items.length === 0 ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-[#111111] text-white"}`}>
                  Procéder au paiement
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}