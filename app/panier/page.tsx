"use client";

import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

// Note: Dans Next.js App Router, les métadonnées pour les pages "use client" 
// se placent normalement dans un layout.tsx parent ou via un composant de tête.
// Pour rester simple et efficace ici, on garde la structure sémantique forte.

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const total = cart.items.reduce((acc, item) => acc + Number(item.price || 0), 0);

  const onRemove = (id: string) => {
    if (cart.removeItem) {
      cart.removeItem(id);
    }
  };

  const getImageUrl = (imageSource: any) => {
    if (!imageSource) return null;
    if (typeof imageSource === 'string' && imageSource.startsWith('http')) return imageSource;
    if (imageSource.asset?.url) return imageSource.asset.url;
    try {
      const url = urlFor(imageSource).url();
      return url || null;
    } catch (e) {
      return null;
    }
  };

  const siteFont = { fontFamily: "Inter, 'Segoe UI', Roboto, sans-serif" };

  return (
    <div style={siteFont} className="bg-white min-h-screen pt-12 pb-24 text-[#111111] selection:bg-blue-100 antialiased">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* COLONNE GAUCHE : ARTICLES */}
          <main className="flex-1 space-y-8 w-full" role="main">
            <header className="lg:pt-4 mb-10">
              <h1 className="text-[22px] md:text-[28px] font-medium tracking-tight leading-none italic">
                Mon panier<span className="text-blue-600">.</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-3">
                {cart.items.length} article(s) sélectionné(s)
              </p>
            </header>

            {cart.items.length === 0 ? (
              <div className="py-32 text-center bg-[#F5F5F7] rounded-[4rem] border border-gray-100">
                <p className="font-medium text-[14px] text-gray-400">Votre panier est vide</p>
                <Link href="/" className="inline-flex items-center gap-3 mt-8 text-blue-600 font-bold uppercase text-[11px] tracking-widest hover:underline">
                    Retourner à la boutique <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <section className="space-y-6"> {/* Sémantique : Groupe d'articles */}
                {cart.items.map((item) => {
                  const imgUrl = getImageUrl(item.images?.[0]);
                  return (
                    <article key={item._id} className="group bg-white p-8 rounded-[2.5rem] shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row items-center transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.07)]">
                      
                      <div className="h-32 w-32 shrink-0 bg-[#F5F5F7] rounded-[2rem] overflow-hidden p-4 flex items-center justify-center">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={`Produit : ${item.name}`} 
                            className="h-full w-full object-contain mix-blend-multiply"
                            loading="lazy" 
                          />
                        ) : (
                          <ShoppingBag className="text-gray-200" size={24} />
                        )}
                      </div>

                      <div className="mt-6 md:mt-0 md:ml-10 flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            <h2 className="text-[24px] font-normal text-gray-900 tracking-tight leading-none capitalize">
                              {item.name}
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-gray-500">
                                  {item.color}
                              </span>
                              <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-gray-500">
                                  {item.capacity}
                              </span>
                              {item.grade && (
                                  <span className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-blue-600">
                                      {item.grade}
                                  </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[22px] font-medium tracking-tighter text-gray-900">{item.price}€</p>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                          <button 
                              onClick={() => onRemove(item._id)} 
                              className="text-[13px] font-bold tracking-tight text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                              aria-label={`Retirer ${item.name} du panier`}
                          >
                            <Trash2 size={16} /> 
                            Retirer
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </main>

          {/* COLONNE DROITE : RÉSUMÉ */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-24" role="complementary">
            <div className="p-10 bg-[#F5F5F7] rounded-[3rem] border border-gray-100 relative overflow-hidden">
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] mb-10 text-blue-600">
                Résumé de commande
              </h2>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-[14px] font-normal text-gray-500">
                  <span>Sous-total</span>
                  <span className="text-gray-900 font-medium">{total}€</span>
                </div>
                <div className="flex justify-between text-[14px] font-normal text-gray-500">
                  <span>Livraison</span>
                  <span className="text-green-600 font-bold text-[11px] uppercase tracking-widest">Offerte</span>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase text-gray-400 tracking-[0.2em]">Total</span>
                  <span className="text-[36px] font-medium tracking-tighter leading-none text-gray-900">{total}€</span>
                </div>

                <Link 
                    href="/checkout" 
                    className={`w-full block py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] mt-10 text-center transition-all active:scale-95 ${
                        cart.items.length === 0 
                        ? "bg-gray-200 text-gray-400 pointer-events-none" 
                        : "bg-[#111111] text-white hover:bg-blue-600 shadow-xl"
                    }`}
                >
                  Procéder au paiement
                </Link>

                {/* LOGOS PAIEMENT : SEO - Ajout de dimensions et ALT */}
                <div className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 w-auto" alt="Paiement Visa sécurisé" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5 w-auto" alt="Paiement PayPal sécurisé" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 w-auto" alt="Paiement Mastercard sécurisé" />
                    </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}