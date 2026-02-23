"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { UserButton, useUser } from "@clerk/nextjs"; 
import { Search, ShoppingBag, Menu, X, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";

interface HeaderProps {
  categories: any[];
  settings: any;
}

export default function Header({ categories, settings }: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const cart = useCart();
  const { isSignedIn } = useUser(); 

  // --- CONFIGURATION STYLE ÉLITE ---
  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
  const brandSlate = "#475569"; // Gris foncé titane
  const brandBlue = "#0066CC";  // Bleu premium RENW

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? cart.items.length : 0;

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setActiveSubMenu(null);
    setIsClosing(true);
    setTimeout(() => setIsClosing(false), 500);
  };

  return (
    <header style={eliteFont} className="fixed top-0 left-0 right-0 z-[1000] w-full bg-white shadow-sm" role="banner">
      
      {/* 1. BARRE PROMO - Harmonie Bleu Premium (Fixe) */}
      {settings?.promoMessage && (
        <div 
          className={`${settings.isPromoActive ? 'bg-[#0066CC]' : 'bg-[#111111]'} text-white py-2 text-center text-[9px] font-bold uppercase tracking-[0.3em] transition-colors duration-500`}
          aria-live="polite"
        >
          {settings.promoMessage}
        </div>
      )}

      {/* 2. BARRE PRINCIPALE */}
      <div className="relative z-[1001] bg-white border-b border-gray-100 h-28 md:h-32 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex items-center justify-between gap-8">
          
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0" aria-label="Retour à l'accueil RENW">
            {settings?.logoImage ? (
              <Image 
                src={urlFor(settings.logoImage).url()} 
                alt={settings?.siteName || "RENW Logo"} 
                width={110} 
                height={55} 
                className="object-contain" 
                priority 
              />
            ) : (
              <span className="text-3xl font-[900] tracking-tighter uppercase text-[#111111]">RENW<span style={{ color: brandSlate }}>.</span></span>
            )}
          </Link>

          {/* Recherche - Ombre subtile et fond doux */}
          <div className="flex-1 max-w-md hidden lg:block">
            <form className="relative group" role="search" action="/search" method="GET">
              <input 
                id="desktop-search"
                type="search" 
                name="q"
                placeholder="Chercher un modèle, une pièce..." 
                className="w-full bg-[#F5F5F7] rounded-full py-4 px-6 pl-12 text-[14px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-md transition-all" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#F5F5F7] p-1.5 rounded-full items-center border border-gray-100 shadow-sm">
              <div className="px-2 min-w-[40px] flex justify-center">
                {isMounted && (isSignedIn ? <UserButton afterSignOutUrl="/" /> : <Link href="/mon-compte" className="text-[20px]" aria-label="Mon compte client">👤</Link>)}
              </div>
              <div className="w-px h-6 bg-gray-300 mx-1" aria-hidden="true"></div>
              
              {/* Panier - Bleu Premium */}
              <Link href="/panier" className="relative w-11 h-11 flex items-center justify-center text-white rounded-full hover:shadow-lg transition-all group" style={{ backgroundColor: brandBlue }}>
                <ShoppingBag size={22} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#111111] text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 font-black animate-in zoom-in" style={{ borderColor: brandBlue }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Link href="/blog" className="bg-[#F1F5F9] text-[#475569] px-7 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#475569] hover:text-white transition-all duration-300 ml-2 hidden md:block border border-gray-200">
              {settings?.magLinkText || "Le Mag"}
            </Link>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#111111]">
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION DESKTOP - Finition Gris Titane / Luxe / Bandeau Affiné (-20%) */}
      <nav className="hidden lg:flex items-center justify-center border-b border-[#334155] shadow-inner" style={{ backgroundColor: brandSlate }} aria-label="Menu principal">
        <ul className="max-w-7xl w-full px-4 md:px-6 flex justify-center relative list-none m-0 p-0">
          {categories?.map((parent, index) => (
            <li key={parent._id || `parent-${index}`} className="group flex items-center static">
              {/* VERSION PC : Police agrandie et affinée */}
              <Link 
                href={`/${parent.slug?.current || parent.slug}`} 
                className="text-[17px] font-normal text-white hover:text-gray-300 transition-colors px-4 py-4"
              >
                {parent.title}
              </Link>

              {/* Mega Menu - Ombre "Vignette Luxe" et Arrondi Fin */}
              <div className={`absolute left-4 right-4 top-full bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 z-[1100] rounded-b-[1.5rem] overflow-hidden translate-y-[-1px] 
                ${isClosing ? "opacity-0 invisible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
                <div className="flex">
                  {/* Image Vignette */}
                  <div className="w-1/6 bg-white p-6 flex items-center justify-center rounded-xl m-4 border border-gray-50 shadow-sm shrink-0">
                    {parent.menuImage && (
                      <Image 
                        src={urlFor(parent.menuImage).url()} 
                        alt={parent.title} 
                        width={150} height={150} 
                        className="object-contain transition-transform duration-700 group-hover:scale-105" 
                      />
                    )}
                  </div>

                  {/* Ligne 1 / Ligne 2 - Séparation aérée */}
                  <div className="flex-1 p-8 flex flex-wrap">
                    {parent.subCategories?.map((sub: any, subIdx: number) => (
                      <div 
                        key={`sub-${sub.title}-${subIdx}`} 
                        className={`w-1/4 px-8 space-y-6 border-gray-200 ${(subIdx + 1) % 4 !== 0 ? 'border-r' : ''} ${subIdx >= 4 ? 'pt-10 mt-10 border-t' : ''}`}
                      >
                        {/* VERSION PC : Sous-catégories agrandies et affinées */}
                        <div className="text-[17px] font-normal border-b border-gray-50 pb-3" style={{ color: brandBlue }}>
                          {sub.title}
                        </div>
                        <ul className="space-y-4 list-none p-0 m-0">
                          {sub.finalModels?.map((model: any, modelIdx: number) => (
                            <li key={`model-${model._id || 'fallback'}-${subIdx}-${modelIdx}`}>
                              <Link 
                                onClick={closeAllMenus}
                                href={`/${model.slug?.current || model.slug}`} 
                                className="text-[14px] font-medium text-gray-500 hover:text-[#111111] flex items-center justify-between group/link transition-all"
                              >
                                {model.title} 
                                <ArrowRight size={14} className="opacity-0 -translate-x-3 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#475569]" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Séparateur Titane pour la barre de menu */}
              {index < categories.length - 1 && <span className="text-white/20 text-[14px] font-light mx-1.5 select-none">|</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. MOBILE DRAWER - Arrondis fins et Police Segoe */}
      <div id="mobile-drawer-menu" className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-500 ${mobileMenuOpen ? "visible" : "invisible pointer-events-none"}`} style={{ top: 'calc(28px + 7rem)' }}>
        <div className="absolute inset-0 bg-[#111111]/30 backdrop-blur-sm transition-opacity" onClick={closeAllMenus} />
        <nav className={`relative w-full bg-white shadow-2xl flex flex-col transition-transform duration-500 max-h-[80vh] rounded-b-[1.5rem] ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
          
          <div className="px-8 py-4 border-b border-gray-50">
            {activeSubMenu && (
              <button onClick={() => setActiveSubMenu(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#475569]">
                <ChevronLeft size={16} /> Retour
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-2">
            {!activeSubMenu ? (
              <ul className="space-y-3 py-4 list-none m-0 p-0">
                {categories?.map((cat, idx) => (
                  <li key={cat._id || `mobile-cat-${idx}`}>
                    {/* VERSION MOBILE : Retour à la police compacte et grasse */}
                    <button onClick={() => setActiveSubMenu(cat)} className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl text-[14px] font-bold text-[#111111]">
                      {cat.title} <ChevronRight size={18} className="text-[#475569]" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-10 py-4">
                {activeSubMenu.subCategories?.map((sub: any, subIdx: number) => (
                  <div key={`mobile-sub-${subIdx}`}>
                    <div className="bg-[#F1F5F9] p-4 rounded-xl mb-4 border border-gray-100">
                        {/* VERSION MOBILE : Retour à la police compacte et grasse */}
                        <p className="font-bold text-[13px]" style={{ color: brandBlue }}>{sub.title}</p>
                    </div>
                    <ul className="grid gap-2 list-none m-0 p-0">
                      {sub.finalModels?.map((model: any, mIdx: number) => (
                        <li key={`mobile-model-${model._id || 'fallback'}-${subIdx}-${mIdx}`}>
                          <Link href={`/${model.slug?.current || model.slug}`} onClick={closeAllMenus} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl font-bold text-[14px] text-[#111111]">
                            {model.title} <ArrowRight size={16} className="text-[#475569]" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8">
            <Link onClick={closeAllMenus} href="/blog" className="w-full bg-[#475569] text-white py-5 rounded-xl flex items-center justify-center font-bold text-[12px] uppercase tracking-widest shadow-md transition-all active:scale-95">
              {settings?.magLinkText || "Le Mag"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}