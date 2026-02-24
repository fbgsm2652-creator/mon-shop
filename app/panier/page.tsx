"use client";

import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image"; 
import { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function PanierPage() {
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

  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <div style={siteFont} className="bg-white min-h-screen pt-12 pb-24 text-[#111111] selection:bg-blue-100 antialiased">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* COLONNE GAUCHE : ARTICLES */}
          <main className="flex-1 space-y-8 w-full" role="main">
            <header className="lg:pt-4 mb-10">
              {/* 🔥 DESIGN : Gras adouci (font-semibold au lieu de font-black) 🔥 */}
              <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-none uppercase">
                Mon panier<span className="text-[#0066CC]">.</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest mt-3">
                {cart.items.length} article(s) sélectionné(s)
              </p>
            </header>

            {cart.items.length === 0 ? (
              <div className="py-32 text-center bg-[#F5F5F7] rounded-[4rem] border border-gray-100 shadow-inner">
                <p className="font-medium text-[16px] text-gray-500">Votre panier est vide.</p>
                <Link href="/" className="inline-flex items-center justify-center gap-3 mt-8 bg-[#0066CC] text-white px-8 py-4 rounded-full font-semibold uppercase text-[11px] tracking-widest hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Retourner à la boutique <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <section className="space-y-6">
                {cart.items.map((item) => {
                  const imgUrl = getImageUrl(item.images?.[0]);
                  return (
                    <article key={item._id} className="group bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row items-center transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.07)]">
                      
                      <div className="relative h-32 w-32 shrink-0 bg-[#F5F5F7] rounded-[2rem] overflow-hidden p-4 flex items-center justify-center border border-gray-100">
                        {imgUrl ? (
                          <Image 
                            src={imgUrl} 
                            alt={`Produit : ${item.name}`} 
                            fill
                            sizes="128px"
                            className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <ShoppingBag className="text-gray-200" size={24} />
                        )}
                      </div>

                      <div className="mt-6 md:mt-0 md:ml-10 flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            {/* 🔥 DESIGN : Gras adouci (font-semibold) 🔥 */}
                            <h2 className="text-[20px] md:text-[24px] font-semibold text-[#111111] tracking-tight leading-tight">
                              {item.name}
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {item.color && (
                                <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase text-gray-500">
                                    {item.color}
                                </span>
                              )}
                              {item.capacity && (
                                <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase text-gray-500">
                                    {item.capacity}
                                </span>
                              )}
                              {item.grade && (
                                  <span className="bg-[#F0F7FF] border border-[#E0F0FF] px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase text-[#0066CC]">
                                      {item.grade}
                                  </span>
                              )}
                            </div>
                          </div>
                          {/* 🔥 DESIGN : Gras adouci pour le prix 🔥 */}
                          <p className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#111111]">{item.price}€</p>
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                          {/* 🔥 DESIGN : Bouton Retirer en ROUGE bien visible 🔥 */}
                          <button 
                              onClick={() => onRemove(item._id)} 
                              aria-label={`Retirer ${item.name} du panier`}
                              className="text-[12px] font-semibold tracking-widest uppercase text-red-500 bg-red-50/50 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
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
          <aside className="w-full lg:w-[400px] lg:sticky lg:top-32">
            <div className="p-8 md:p-10 bg-[#F5F5F7] rounded-[3rem] border border-gray-100 relative overflow-hidden shadow-sm">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-8 text-[#0066CC]">
                Résumé de commande
              </h2>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-[14px] font-medium text-gray-500">
                  <span>Sous-total</span>
                  <span className="text-[#111111] font-semibold">{total}€</span>
                </div>
                <div className="flex justify-between text-[14px] font-medium text-gray-500">
                  <span>Livraison (Colissimo)</span>
                  <span className="text-green-600 font-semibold text-[11px] uppercase tracking-widest bg-green-100/50 px-2 py-1 rounded-md">Offerte</span>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 tracking-[0.2em] mb-1">Total TTC</span>
                  {/* 🔥 DESIGN : Gras adouci pour le total 🔥 */}
                  <span className="text-[36px] md:text-[42px] font-bold tracking-tight leading-none text-[#111111]">{total}€</span>
                </div>

                {/* 🔥 DESIGN : Bouton VALIDER en BLEU 🔥 */}
                <Link 
                    href="/checkout" 
                    className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-semibold uppercase tracking-widest text-[12px] mt-8 text-center transition-all ${
                        cart.items.length === 0 
                        ? "bg-gray-200 text-gray-400 pointer-events-none" 
                        : "bg-[#0066CC] text-white hover:opacity-90 shadow-[0_8px_25px_rgba(0,102,204,0.25)] hover:shadow-[0_12px_30px_rgba(0,102,204,0.3)] hover:-translate-y-1"
                    }`}
                >
                  Valider la commande <ArrowRight size={16} />
                </Link>

                <div className="mt-10 flex flex-col items-center gap-6 pt-8 border-t border-gray-200/50">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Paiement Rapide & Sécurisé</span>
                    
                    {/* 🔥 DESIGN : Apple Pay, Google Pay ET Visa en couleur 🔥 */}
                    <div className="flex items-center justify-center gap-8 transition-all duration-500">
                        <img loading="lazy" decoding="async" src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6 w-auto" alt="Paiement par Apple Pay" />
                        <img loading="lazy" decoding="async" src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-6 w-auto" alt="Paiement par Google Pay" />
                        <img loading="lazy" decoding="async" src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 w-auto" alt="Paiement par carte Visa" />
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