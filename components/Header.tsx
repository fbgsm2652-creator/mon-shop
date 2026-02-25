"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import { UserButton, useUser } from "@clerk/nextjs"; 
import { Search, ShoppingBag, Menu, X, ArrowRight, ChevronRight, ChevronLeft, User, ChevronDown, SmartphoneNfc } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { FaApple, FaAndroid, FaWindows, FaGoogle } from "react-icons/fa";
import { SiSamsung, SiXiaomi, SiHuawei, SiOppo, SiSony, SiAsus } from "react-icons/si";

interface HeaderProps {
  categories: any[];
  settings: any;
}

const BRAND_MAP = [
  { keywords: ['apple', 'appel', 'iphone', 'ipad', 'mac'], icon: FaApple },
  { keywords: ['samsung', 'galaxy'], icon: SiSamsung },
  { keywords: ['xiaomi', 'redmi', 'poco'], icon: SiXiaomi },
  { keywords: ['huawei', 'honor'], icon: SiHuawei },
  { keywords: ['oppo'], icon: SiOppo },
  { keywords: ['sony', 'xperia'], icon: SiSony },
  { keywords: ['asus'], icon: SiAsus },
  { keywords: ['google', 'pixel'], icon: FaGoogle },
  { keywords: ['android'], icon: FaAndroid },
  { keywords: ['windows', 'microsoft'], icon: FaWindows },
];

export default function Header({ categories, settings }: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<any>(null);
  
  // 🔥 L'INTERRUPTEUR MAGIQUE POUR FORCER LA FERMETURE SUR PC 🔥
  const [forceClose, setForceClose] = useState(false);
  
  const cart = useCart();
  const { isSignedIn } = useUser(); 

  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
  const brandSlate = "#111111"; 
  const brandBlue = "#0066CC";  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? cart.items.length : 0;

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setActiveSubMenu(null);
    setForceClose(true); // 🔥 On active la fermeture forcée au clic
  };

  const renderIcon = (iconString: string, size: number = 18) => {
    if (!iconString) return null;
    const lowerStr = iconString.toLowerCase();
    const matchedBrand = BRAND_MAP.find(brand => brand.keywords.some(keyword => lowerStr.includes(keyword)));
    if (matchedBrand) {
      const BrandIcon = matchedBrand.icon;
      return <BrandIcon size={size} />;
    }
    const IconComponent = (LucideIcons as any)[iconString];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  return (
    <header style={eliteFont} className="fixed top-0 left-0 right-0 z-[1000] w-full bg-white shadow-sm flex flex-col" role="banner">

      {/* 1. BARRE PRINCIPALE (BLANCHE) */}
      <div className="relative z-[1001] bg-white flex flex-col w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-[60px] md:h-24 flex items-center justify-between">
          
          <div className="flex-1 flex lg:hidden items-center justify-start">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-[#111111]" aria-label="Ouvrir le menu principal">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start shrink-0">
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Retour à l'accueil">
              {settings?.logoImage ? (
                <Image src={urlFor(settings.logoImage).url()} alt="RENW Logo" width={120} height={60} className="object-contain" priority />
              ) : (
                <span className="text-3xl font-[900] tracking-tighter text-[#111111] uppercase">RENW<span style={{ color: brandBlue }}>.</span></span>
              )}
            </Link>
          </div>

          {/* RECHERCHE DESKTOP */}
          <div className="flex-1 px-8 hidden lg:flex items-center gap-3">
            <form className="relative group flex-1" role="search" action="/search" method="GET">
              <input type="search" name="q" placeholder="Chercher un produit, modèle..." aria-label="Rechercher un produit" className="w-full bg-[#F5F5F7] rounded-full py-2.5 px-5 pl-11 text-[13px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-md transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} aria-hidden="true" />
            </form>
          </div>

          <div className="flex-1 lg:flex-none flex items-center justify-end gap-4 md:gap-6">
            <div className="text-[#111111] hover:text-[#0066CC] transition-colors cursor-pointer">
              {isMounted && (isSignedIn ? <UserButton afterSignOutUrl="/" /> : <Link href="/mon-compte" aria-label="Accéder à mon compte"><User size={24} strokeWidth={1.5} aria-hidden="true" /></Link>)}
            </div>
            <Link href="/panier" className="relative text-[#111111] hover:text-[#0066CC] transition-colors group flex items-center" aria-label="Voir mon panier">
              <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#0066CC] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
            </Link>
            <Link href="/blog" className="bg-[#F1F5F9] text-[#475569] px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all hidden md:block">
              {settings?.magLinkText || "Le Mag"}
            </Link>
          </div>
        </div>
      </div>

      {/* RECHERCHE MOBILE FIXE */}
      <div className="w-full px-4 pb-3 lg:hidden mt-1 bg-white border-b border-gray-100 relative z-[1001]">
        <form className="relative w-full" role="search" action="/search" method="GET">
          <input type="search" name="q" placeholder="Chercher un produit, modèle..." aria-label="Rechercher un produit" className="w-full bg-[#F5F5F7] rounded-full py-3 px-6 pl-12 text-[14px] font-medium outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
        </form>
      </div>

      {/* 2. LA GRANDE BARRE NOIRE */}
      <nav className="hidden lg:block shadow-md relative z-[1000]" style={{ backgroundColor: brandSlate }} aria-label="Menu principal">
        <ul className="max-w-7xl mx-auto px-6 flex items-center justify-start list-none m-0 p-0">
          {categories?.map((parent, index) => (
            
            // 🔥 On désactive la fermeture forcée dès que la souris quitte la catégorie 🔥
            <li 
              key={`parent-${index}`} 
              className="group static flex items-center" 
              onMouseLeave={() => setForceClose(false)}
            >
              
              {/* 🔥 On ferme aussi si le client clique sur la catégorie principale 🔥 */}
              <Link 
                prefetch={false} 
                href={`/${parent.slug}`} 
                onClick={() => setForceClose(true)} 
                className="flex items-center gap-2 text-[15px] font-semibold text-white hover:text-[#0066CC] transition-colors px-4 py-3.5"
              >
                {parent.icon && <span className="text-gray-300 group-hover:text-[#0066CC] transition-colors" aria-hidden="true">{renderIcon(parent.icon, 18)}</span>}
                {parent.title}
              </Link>

              {/* SÉPARATEUR BLANC PUR */}
              {index < categories.length - 1 && (
                <div className="h-4 w-[1px] bg-white mx-2 opacity-80" aria-hidden="true"></div>
              )}

              {/* LE MEGA MENU GEANT */}
              {/* 🔥 La classe s'adapte magiquement grâce au state forceClose 🔥 */}
              <div className={`absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-[0_40px_100px_rgba(0,0,0,0.15)] transition-all duration-300 z-[1100] border-b-[4px] border-[#0066CC] ${forceClose ? 'hidden' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                <div className="flex w-full max-w-[1600px] mx-auto min-h-[400px]">
                  
                  {/* L'IMAGE A GAUCHE */}
                  {parent.menuImage && (
                    <div className="w-[300px] bg-[#FBFBFD] p-8 flex flex-col items-center justify-center border-r border-gray-100 shrink-0">
                      <Image 
                        src={urlFor(parent.menuImage).url()} 
                        alt={`Image de la catégorie ${parent.title}`} 
                        width={220} height={220} 
                        className="object-contain transition-transform duration-700 hover:scale-105 drop-shadow-xl" 
                      />
                    </div>
                  )}

                  {/* LES COLONNES */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 divide-x divide-gray-100">
                      
                      {parent.subCategories?.map((sub: any, subIdx: number) => (
                        <div key={`sub-${subIdx}`} className="flex flex-col bg-white">
                          
                          {/* LA 2EME BARRE */}
                          <div className="bg-[#F1F5F9] px-6 py-3.5 border-b border-gray-200 flex items-center gap-3 min-h-[55px]">
                            {sub.icon && <span className="text-[#0066CC]" aria-hidden="true">{renderIcon(sub.icon, 18)}</span>}
                            <span className="text-[14px] font-bold text-[#111111]">{sub.title}</span>
                          </div>
                          
                          {/* LES LIENS FINAUX */}
                          <ul className="p-6 space-y-4 list-none m-0">
                            {sub.finalModels?.map((model: any, modelIdx: number) => (
                              <li key={`model-${modelIdx}`}>
                                <Link 
                                  prefetch={false}
                                  onClick={closeAllMenus}
                                  href={`/${model.slug?.current || model.slug}`} 
                                  className="text-[14px] font-medium text-gray-500 hover:text-[#0066CC] flex items-center group/link transition-all"
                                >
                                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#0066CC] mr-2" aria-hidden="true" />
                                  {model.title || model.name}
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
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. BARRE PROMO */}
      {settings?.promoMessage && (
        <div className="bg-[#F5F5F7] text-[#111111] py-2 text-center text-[11px] md:text-[12px] font-bold uppercase w-full border-t border-gray-100" aria-live="polite">
          {settings.promoMessage}
        </div>
      )}

      {/* 4. MOBILE DRAWER */}
      <div id="mobile-drawer-menu" className={`absolute left-0 w-full z-[990] lg:hidden transition-all duration-500 shadow-2xl ${mobileMenuOpen ? "top-full opacity-100 visible" : "top-[90%] opacity-0 invisible pointer-events-none"}`} aria-hidden={!mobileMenuOpen}>
        
        <nav className="w-full bg-white flex flex-col max-h-[75vh] overflow-hidden border-t border-gray-100" aria-label="Menu mobile">
          <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
            {!activeSubMenu ? (
              <ul className="space-y-2 py-2">
                {categories?.map((cat, idx) => (
                  <li key={idx}>
                    <button onClick={() => setActiveSubMenu(cat)} className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl text-[15px] font-semibold text-[#111111]" aria-expanded={activeSubMenu === cat}>
                      <div className="flex items-center gap-3">
                        {cat.icon && <span className="text-[#0066CC]" aria-hidden="true">{renderIcon(cat.icon, 20)}</span>}
                        {cat.title}
                      </div>
                      <ChevronRight size={18} className="text-gray-400" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-6 py-4">
                <button onClick={() => setActiveSubMenu(null)} className="flex items-center gap-2 text-[13px] font-black text-[#0066CC] mb-4 px-2" aria-label="Retour au menu principal">
                  <ChevronLeft size={16} aria-hidden="true" /> Retour
                </button>
                {activeSubMenu.subCategories?.map((sub: any, subIdx: number) => (
                  <div key={`mob-sub-${subIdx}`}>
                    <div className="p-3 mb-2 bg-[#F1F5F9] rounded-lg flex items-center gap-2">
                        {sub.icon && <span className="text-[#0066CC]" aria-hidden="true">{renderIcon(sub.icon, 16)}</span>}
                        <p className="font-bold text-[14px] text-[#111111]">{sub.title}</p>
                    </div>
                    <ul className="grid gap-2 px-2">
                      {sub.finalModels?.map((model: any, mIdx: number) => (
                        <li key={mIdx}>
                          <Link prefetch={false} href={`/${model.slug?.current || model.slug}`} onClick={closeAllMenus} className="flex items-center justify-between py-3 border-b border-gray-50 font-medium text-[14px] text-gray-600 hover:text-[#0066CC]">
                            {model.title || model.name} <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 h-screen w-screen" onClick={closeAllMenus} aria-hidden="true" />
      </div>
    </header>
  );
}