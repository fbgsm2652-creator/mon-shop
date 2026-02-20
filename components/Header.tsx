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

  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

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
      
      {/* 1. BARRE PROMO */}
      {settings?.promoMessage && (
        <div 
          className={`${settings.isPromoActive ? 'bg-blue-600 animate-pulse' : 'bg-[#111111]'} text-white py-2 text-center text-[9px] font-bold uppercase tracking-[0.3em] transition-colors duration-500`}
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
              <span className="text-3xl font-[900] tracking-tighter uppercase text-[#111111]">RENW<span className="text-blue-600">.</span></span>
            )}
          </Link>

          <div className="flex-1 max-w-md hidden lg:block">
            <form className="relative group" role="search" action="/search" method="GET">
              <label htmlFor="desktop-search" className="sr-only">Chercher un modèle ou une pièce</label>
              <input 
                id="desktop-search"
                type="search" 
                name="q"
                placeholder="Chercher un modèle, une pièce..." 
                className="w-full bg-[#F5F5F7] rounded-full py-4 px-6 pl-12 text-[14px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 transition-all shadow-sm" 
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
              
              <Link href="/panier" className="relative w-11 h-11 flex items-center justify-center bg-[#111111] text-white rounded-full hover:bg-blue-600 transition-all shadow-lg group" aria-label={`Voir le panier, ${cartCount} articles`}>
                <ShoppingBag size={22} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Link href="/blog" className="bg-[#E0F2FE] text-[#0369a1] px-7 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#0369a1] hover:text-white transition-all duration-300 ml-2 hidden md:block border border-[#bae6fd]">
              {settings?.magLinkText || "Le Mag"}
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-[#111111]"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer-menu"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
            >
              {mobileMenuOpen ? <X size={32} aria-hidden="true" /> : <Menu size={32} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION DESKTOP CORRIGÉE */}
      <nav className="hidden lg:flex items-center justify-center bg-[#F8FAFC] border-b border-gray-100" aria-label="Menu principal">
        <ul className="max-w-7xl w-full px-4 md:px-6 flex justify-center relative list-none m-0 p-0">
          {categories?.map((parent, index) => (
            <li key={parent._id} className="group flex items-center static">
              <Link 
                href={`/${parent.slug?.current || parent.slug}`} 
                className="text-[12px] font-bold text-[#111111] hover:text-blue-600 transition-colors uppercase tracking-[0.15em] px-4 py-5"
              >
                {parent.title}
              </Link>

              {/* Mega Menu - Optimisé pour l'espace */}
              <div className={`absolute left-4 right-4 top-full bg-white border border-gray-100 shadow-2xl transition-all duration-300 z-[1100] rounded-b-[2.5rem] overflow-hidden translate-y-[-1px] 
                ${isClosing ? "opacity-0 invisible pointer-events-none" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
                <div className="flex">
                  {/* Image réduite de 50% (w-1/6 au lieu de 1/4) */}
                  <div className="w-1/6 bg-[#F9F9FB] p-6 flex items-center justify-center rounded-2xl m-4 shrink-0">
                    {parent.menuImage && (
                      <Image 
                        src={urlFor(parent.menuImage).url()} 
                        alt={`Découvrez la collection ${parent.title}`} 
                        width={150} 
                        height={150} 
                        className="object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" 
                      />
                    )}
                  </div>

                  {/* Zone de contenu flexible avec passage à la ligne (flex-wrap) */}
                  <div className="flex-1 p-8 flex flex-wrap gap-y-10">
                    {parent.subCategories?.map((sub: any, subIdx: number) => (
                      <div 
                        key={sub._id} 
                        className={`min-w-[200px] px-8 space-y-6 border-gray-100 
                          ${/* Ligne verticale */ (subIdx + 1) % 4 !== 0 ? 'border-r' : ''} 
                          ${/* Ligne horizontale si trop de lignes */ parent.subCategories.length > 4 ? 'border-b pb-10' : ''}`}
                      >
                        <div className="text-[11px] font-[800] uppercase tracking-widest text-blue-600 border-b border-gray-50 pb-3" aria-hidden="true">{sub.title}</div>
                        <ul className="space-y-4 list-none p-0 m-0">
                          {sub.finalModels?.map((model: any) => (
                            <li key={model._id}>
                              <Link 
                                onClick={closeAllMenus}
                                href={`/${model.slug?.current || model.slug}`} 
                                className="text-[14px] font-medium text-gray-600 hover:text-black flex items-center justify-between group/link transition-all"
                              >
                                {model.title} 
                                <ArrowRight size={14} className="opacity-0 -translate-x-3 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-600" aria-hidden="true" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index < categories.length - 1 && <span className="text-blue-600 text-[14px] font-bold mx-1.5 select-none" aria-hidden="true">|</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. MOBILE DRAWER - INCHANGÉ */}
      <div 
        id="mobile-drawer-menu"
        className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-500 ${mobileMenuOpen ? "visible" : "invisible pointer-events-none"}`}
        style={{ top: 'calc(28px + 7rem)' }}
        aria-hidden={!mobileMenuOpen}
      >
        <div className={`absolute inset-0 bg-[#111111]/40 backdrop-blur-sm transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={closeAllMenus} aria-hidden="true" />
        
        <nav className={`relative w-full bg-white shadow-2xl flex flex-col transition-transform duration-500 max-h-[80vh] rounded-b-[2rem] ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`} aria-label="Menu mobile">
          
          <div className="px-8 py-4 border-b border-gray-50 flex items-center">
            {activeSubMenu && (
              <button onClick={() => setActiveSubMenu(null)} className="flex items-center gap-2 text-[10px] font-bold uppercase text-blue-600" aria-label="Retour au menu principal">
                <ChevronLeft size={16} aria-hidden="true" /> Retour
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-2 font-medium">
            {!activeSubMenu ? (
              <ul className="space-y-3 py-4 list-none p-0 m-0">
                {categories?.map((cat) => (
                  <li key={cat._id}>
                    <button 
                      onClick={() => setActiveSubMenu(cat)} 
                      className="w-full flex items-center justify-between p-4 bg-gray-50/50 rounded-xl text-[14.5px] font-bold tracking-tight text-[#111111]"
                      aria-haspopup="true"
                      aria-expanded={activeSubMenu === cat}
                    >
                      {cat.title} <ChevronRight size={18} className="text-blue-600" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-10 py-4">
                {activeSubMenu.subCategories?.map((sub: any) => (
                  <div key={sub._id}>
                    <div className="bg-[#E0F2FE] p-4 rounded-xl mb-4 border border-[#bae6fd]">
                        <p className="text-[#0369a1] font-bold uppercase text-[11px] tracking-[0.15em]">{sub.title}</p>
                    </div>
                    
                    <ul className="grid gap-2 list-none p-0 m-0">
                      {sub.finalModels?.map((model: any) => (
                        <li key={model._id}>
                          <Link href={`/${model.slug?.current || model.slug}`} onClick={closeAllMenus} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl font-bold text-[14px] text-[#111111]">
                            {model.title} <ArrowRight size={16} className="text-blue-600" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8 bg-white rounded-b-[2rem]">
            <Link onClick={closeAllMenus} href="/blog" className="w-full bg-[#E0F2FE] text-[#0369a1] py-5 rounded-2xl flex items-center justify-center font-bold text-[12px] uppercase tracking-widest border border-[#bae6fd] shadow-sm transition-transform active:scale-95">
              {settings?.magLinkText || "Le Mag"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}