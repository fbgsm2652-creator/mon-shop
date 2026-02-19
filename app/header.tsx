"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { UserButton, useUser } from "@clerk/nextjs"; 
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const [categories, setCategories] = useState<any[]>([]);
  const [headerData, setHeaderData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cart = useCart();
  const { isSignedIn } = useUser(); 

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      const query = `{
        "categories": *[_type == "category" && !defined(parent)]{
          _id, title, menuImage,
          "subCategories": *[_type == "category" && references(^._id)]{
            _id, title,
            "finalModels": *[_type == "category" && references(^._id)]{
              _id, title, "slug": slug.current
            }
          }
        },
        "settings": *[_type == "headerSettings"][0]
      }`;
      const data = await client.fetch(query);
      setCategories(data.categories);
      setHeaderData(data.settings);
    };
    fetchData();
  }, []);

  const cartCount = isMounted ? (cart as any).items?.length : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] w-full font-sans bg-white selection:bg-blue-100" role="banner">
      
      {/* 1. BARRE PROMO */}
      {headerData?.promoMessage && (
        <div 
          className={`${headerData.isPromoActive ? 'bg-blue-600 animate-pulse' : 'bg-[#111111]'} text-white py-2 text-center text-[9px] font-black uppercase tracking-[0.3em] italic transition-colors duration-500`}
          aria-label="Promotion en cours"
        >
          {headerData.promoMessage}
        </div>
      )}

      {/* 2. BARRE PRINCIPALE */}
      <div className="border-b border-gray-100 h-28 md:h-32 flex items-center bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex items-center justify-between gap-8">
          
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0" aria-label="Accueil RENW">
            {headerData?.logoImage ? (
              <Image 
                src={urlFor(headerData.logoImage).url()} 
                alt={headerData?.logoText || "Renw Expertise"} 
                width={headerData?.logoWidth || 120} 
                height={60}
                className="object-contain"
                priority
              />
            ) : (
              <span className="text-3xl font-[1000] tracking-tighter uppercase italic text-[#111111]">RENW<span className="text-blue-600">.</span></span>
            )}
          </Link>

          {/* RECHERCHE SEO */}
          <div className="flex-1 max-w-md hidden lg:block">
            <form className="relative group" action="/search" method="GET">
              <input 
                type="text" 
                name="q"
                placeholder="Chercher un modèle, une pièce..." 
                className="w-full bg-[#F5F5F7] rounded-full py-4 px-6 pl-12 text-[13px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#F5F5F7] p-1.5 rounded-full items-center border border-gray-100 shadow-sm">
              <div className="px-2">
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <Link href="/mon-compte" className="text-[#111111] hover:text-blue-600 transition-colors" aria-label="Se connecter">
                    <span className="text-[20px]">👤</span>
                  </Link>
                )}
              </div>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <Link href="/panier" className="relative w-10 h-10 flex items-center justify-center bg-[#111111] text-white rounded-full hover:bg-blue-600 transition-all shadow-lg group" aria-label="Voir le panier">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Link href="/blog" className="bg-[#E0F2FE] text-[#0369a1] px-7 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-[#0369a1] hover:text-white transition-all duration-300 ml-2 hidden md:block border border-[#bae6fd]">
              {headerData?.magLinkText || "Le Mag"}
            </Link>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#111111]" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION MÉGA MENU */}
      <nav className="hidden lg:flex items-center justify-center bg-[#F8FAFC] border-b border-gray-100" aria-label="Navigation principale">
        <div className="flex gap-12">
          {categories?.map((parent) => (
            <div key={parent._id} className="group py-4">
              <span className="text-[10px] font-black cursor-default uppercase tracking-[0.3em] text-[#111111] group-hover:text-blue-600 transition-colors">
                {parent.title}
              </span>
              
              <div className="absolute left-0 top-full w-full bg-white border-b border-gray-200 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-7xl mx-auto flex min-h-[380px]">
                  <div className="w-1/4 bg-[#FAFAFA] p-8 flex flex-col justify-center items-center">
                    {parent.menuImage && (
                      <Image 
                        src={urlFor(parent.menuImage).url()} 
                        alt={`Aperçu ${parent.title}`}
                        width={300}
                        height={300}
                        className="max-h-52 object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="flex-1 p-8 grid grid-cols-3 gap-y-6">
                    {parent.subCategories?.map((sub: any, idx: number) => (
                      <div key={sub._id} className={`px-10 space-y-4 ${idx % 3 !== 0 ? 'border-l border-[#bae6fd]' : ''}`}>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 pb-2 italic border-b border-blue-50">{sub.title}</h4>
                        <ul className="space-y-3">
                          {sub.finalModels?.map((model: any) => (
                            <li key={model._id}>
                              <Link href={`/${model.slug}`} className="text-[14px] font-[600] text-gray-700 hover:text-blue-600 transition-all flex items-center justify-between group/link tracking-tight">
                                {model.title}
                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-600" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* 4. MOBILE MENU */}
      <div className={`fixed inset-0 bg-[#F5F5F7] z-[999] pt-40 px-4 lg:hidden transition-all duration-500 flex flex-col justify-between pb-10 ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
         <div className="overflow-y-auto" role="navigation">
           <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {categories?.map((cat) => (
                <Link key={cat._id} onClick={() => setMobileMenuOpen(false)} href={`/${cat.slug || cat.title.toLowerCase()}`} className="flex items-center justify-between p-6">
                  <span className="text-lg font-bold text-[#111111]">{cat.title}</span>
                  <ArrowRight size={20} className="text-blue-600" />
                </Link>
              ))}
           </div>
         </div>
         <Link onClick={() => setMobileMenuOpen(false)} href="/blog" className="w-full bg-[#111111] text-white py-6 rounded-2xl text-center font-black text-sm uppercase tracking-[0.2em] shadow-xl">
           {headerData?.magLinkText || "Le Mag"}
         </Link>
      </div>
    </header>
  );
}