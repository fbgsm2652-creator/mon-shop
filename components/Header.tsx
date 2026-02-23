"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { UserButton, useUser } from "@clerk/nextjs"; 
import { Search, ShoppingBag, Menu, X, ArrowRight, ChevronRight, ChevronLeft, User } from "lucide-react";

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
  const brandSlate = "#1e293b"; 
  const brandBlue = "#0066CC";  

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
    <header style={eliteFont} className="fixed top-0 left-0 right-0 z-[1000] w-full bg-white shadow-sm flex flex-col" role="banner">

      {/* 1. BARRE PRINCIPALE (Hauteur affinée sur Mobile h-[60px]) */}
      <div className="relative z-[1001] bg-white flex flex-col w-full">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-[60px] md:h-32 flex items-center justify-between">
          
          {/* A. GAUCHE SUR MOBILE : Menu Hamburger */}
          <div className="flex-1 flex lg:hidden items-center justify-start">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-[#111111]" aria-label="Menu principal">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* B. CENTRE SUR MOBILE / GAUCHE SUR PC : Logo */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start shrink-0">
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Retour à l'accueil RENW">
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
          </div>

          {/* C. CENTRE SUR PC : Barre de recherche Desktop */}
          <div className="flex-1 max-w-2xl px-8 hidden lg:block">
            <form className="relative group w-full" role="search" action="/search" method="GET">
              <input 
                id="desktop-search"
                type="search" 
                name="q"
                placeholder="Chercher un modèle, une pièce..." 
                className="w-full bg-[#F5F5F7] rounded-full py-3.5 px-6 pl-12 text-[14px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-md transition-all" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            </form>
          </div>

          {/* D. DROITE : Icônes (Séparées) */}
          <div className="flex-1 lg:flex-none flex items-center justify-end gap-3 md:gap-5">
            <div className="flex items-center justify-center p-2 text-[#111111] hover:text-[#0066CC] transition-colors cursor-pointer">
              {isMounted && (isSignedIn ? <UserButton afterSignOutUrl="/" /> : <Link href="/mon-compte" aria-label="Mon compte client"><User size={24} strokeWidth={1.5} /></Link>)}
            </div>
            
            <Link href="/panier" className="relative p-2 text-[#111111] hover:text-[#0066CC] transition-colors group flex items-center justify-center" aria-label="Voir mon panier">
              <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#0066CC] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-in zoom-in border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/blog" className="bg-[#F1F5F9] text-[#475569] px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#1e293b] hover:text-white transition-all duration-300 ml-2 hidden md:block border border-gray-200">
              {settings?.magLinkText || "Le Mag"}
            </Link>
          </div>
        </div>

        {/* 1.BIS BARRE DE RECHERCHE MOBILE (Remontée via margin négatif) */}
        <div className="w-full px-4 pb-3 lg:hidden -mt-2">
          <form className="relative w-full" role="search" action="/search" method="GET">
            <input 
              type="search" 
              name="q"
              placeholder="Chercher un appareil, une pièce..." 
              className="w-full bg-[#F5F5F7] rounded-full py-3.5 px-6 pl-12 text-[14px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-md transition-all" 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
          </form>
        </div>
      </div>

      {/* 2. NAVIGATION DESKTOP */}
      <nav className="hidden lg:flex items-center justify-center shadow-inner" style={{ backgroundColor: brandSlate }} aria-label="Menu principal">
        <ul className="max-w-7xl w-full px-4 md:px-6 flex justify-center relative list-none m-0 p-0">
          {categories?.map((parent, index) => (
            <li key={parent._id || `parent-${index}`} className="group flex items-center static">
              <Link 
                href={`/${parent.slug?.current || parent.slug}`} 
                className="text-[16px] font-normal text-white hover:text-gray-300 transition-colors px-4 py-2.5"
              >
                {parent.title}
              </Link>

              {/* Mega Menu */}
              <div className={`absolute left-4 right-4 top-full bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 z-[1100] rounded-b-[1.5rem] overflow-hidden translate-y-[-1px] 
                ${isClosing ? "opacity-0 invisible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
                <div className="flex">
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

                  <div className="flex-1 p-8 flex flex-wrap">
                    {parent.subCategories?.map((sub: any, subIdx: number) => (
                      <div 
                        key={`sub-${sub.title}-${subIdx}`} 
                        className={`w-1/4 px-8 space-y-6 border-gray-200 ${(subIdx + 1) % 4 !== 0 ? 'border-r' : ''} ${subIdx >= 4 ? 'pt-10 mt-10 border-t' : ''}`}
                      >
                        <div className="text-[16px] font-medium border-b border-gray-50 pb-3" style={{ color: brandBlue }}>
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
              {index < categories.length - 1 && <span className="text-white/20 text-[14px] font-light mx-1.5 select-none">|</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. BARRE PROMO (CORRIGÉE : Bleu-gris clair doux, texte foncé, minuscule) */}
      {settings?.promoMessage && (
        <div 
          // Changement ici : Fond clair (#F1F5F9), texte foncé (#1e293b), retrait de 'uppercase' et 'tracking'
          className="bg-[#F1F5F9] text-[#1e293b] py-2.5 text-center text-[11px] md:text-[12px] font-medium tracking-normal w-full border-t border-gray-100"
          aria-live="polite"
        >
          {settings.promoMessage}
        </div>
      )}

      {/* 4. MOBILE DRAWER - Menu latéral */}
      <div id="mobile-drawer-menu" className={`absolute left-0 w-full z-[990] lg:hidden transition-all duration-500 shadow-2xl ${mobileMenuOpen ? "top-full opacity-100 visible" : "top-[90%] opacity-0 invisible pointer-events-none"}`}>
        <nav className="w-full bg-white flex flex-col max-h-[75vh] overflow-hidden rounded-b-[1.5rem] border-t border-gray-100">
          
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            {activeSubMenu && (
              <button onClick={() => setActiveSubMenu(null)} className="flex items-center gap-2 text-[11px] font-black uppercase text-[#475569]">
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            {!activeSubMenu && (
               <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Navigation</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2 bg-white">
            {!activeSubMenu ? (
              <ul className="space-y-2 py-2 list-none m-0 p-0">
                {categories?.map((cat, idx) => (
                  <li key={cat._id || `mobile-cat-${idx}`}>
                    <button onClick={() => setActiveSubMenu(cat)} className="w-full flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-[#E2E8F0] transition-colors rounded-xl text-[14px] font-bold text-[#111111]">
                      {cat.title} <ChevronRight size={18} className="text-[#475569]" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-8 py-4">
                {activeSubMenu.subCategories?.map((sub: any, subIdx: number) => (
                  <div key={`mobile-sub-${subIdx}`}>
                    <div className="p-2 mb-2 border-b border-gray-100">
                        <p className="font-bold text-[13px] uppercase tracking-wider" style={{ color: brandBlue }}>{sub.title}</p>
                    </div>
                    <ul className="grid gap-2 list-none m-0 p-0">
                      {sub.finalModels?.map((model: any, mIdx: number) => (
                        <li key={`mobile-model-${model._id || 'fallback'}-${subIdx}-${mIdx}`}>
                          <Link href={`/${model.slug?.current || model.slug}`} onClick={closeAllMenus} className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl font-bold text-[14px] text-[#111111] shadow-sm">
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
          
          <div className="p-6 bg-white border-t border-gray-50">
            <Link onClick={closeAllMenus} href="/blog" className="w-full bg-[#1e293b] text-white py-4 rounded-xl flex items-center justify-center font-bold text-[12px] uppercase tracking-widest shadow-md transition-all active:scale-95">
              {settings?.magLinkText || "Le Mag"}
            </Link>
          </div>
        </nav>
        {/* Overlay d'assombrissement pour le reste de la page */}
        <div className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm -z-10 h-screen w-screen" onClick={closeAllMenus} />
      </div>

    </header>
  );
}