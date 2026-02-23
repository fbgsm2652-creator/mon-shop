"use client";
import { useState, useEffect, useRef } from "react";
import { PortableText } from "@portabletext/react";
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ChevronRight, Plus } from "lucide-react";

// --- ICÔNES ---
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`mr-1.5 w-5 h-5 md:w-6 md:h-6 shrink-0 ${className}`}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);
const PlusIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default function ProductPageClient({ product }: { product: any }) {
  const cart = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0); 
  const [selectedCap, setSelectedCap] = useState(0); 
  const [selectedSimpleVar, setSelectedSimpleVar] = useState(0); 
  const [selectedColor, setSelectedColor] = useState(0);
  const [userHasSelectedColor, setUserHasSelectedColor] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Desktop Gallery State
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  
  // Sticky Bar Logic
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }

    return () => {
      if (addToCartRef.current) observer.unobserve(addToCartRef.current);
    };
  }, []);

  if (!product) return null;

  const isReconditioned = product.isReconditioned === true;
  
  // Calculs Prix Principal
  let unitPrice = 0;
  if (isReconditioned) {
    unitPrice = product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.price || 0;
  } else if (product.simpleVariants && product.simpleVariants.length > 0) {
    unitPrice = product.simpleVariants[selectedSimpleVar]?.price || 0;
  } else {
    unitPrice = product.price || 0;
  }

  const priceWhenNew = product.priceWhenNew || 0;
  const savings = priceWhenNew > unitPrice ? priceWhenNew - unitPrice : 0;

  const safeColors = Array.isArray(product.colors) ? product.colors : [];
  const currentColor = safeColors[selectedColor] || "";
  
  const displayImage = !userHasSelectedColor 
    ? (product.mainImage || product.images?.[0]) 
    : (product.images?.find((img: any) => img.colorAssoc === currentColor) || product.mainImage);

  const allImages = [displayImage, ...(product.images || [])].filter((v, i, a) => a.findIndex(t => (t.asset?._ref === v.asset?._ref)) === i);

  // Cross-sell logic
  const crossSellProduct = product.crossSell;
  let crossSellPrice = 0;
  if (crossSellProduct) {
    if (crossSellProduct.isReconditioned) {
      crossSellPrice = crossSellProduct.grades?.[0]?.capacities?.[0]?.price || 0;
    } else if (crossSellProduct.simpleVariants && crossSellProduct.simpleVariants.length > 0) {
      crossSellPrice = crossSellProduct.simpleVariants[0]?.price || 0;
    } else {
      crossSellPrice = crossSellProduct.price || 0;
    }
  }

  const bundlePrice = unitPrice + crossSellPrice;
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://renw.fr" },
          ...(product.category ? [{ "@type": "ListItem", "position": 2, "name": product.category.title || product.category.name, "item": `https://renw.fr/categories/${product.category.slug?.current}` }] : []),
          { "@type": "ListItem", "position": product.category ? 3 : 2, "name": product.name }
        ]
      },
      {
        "@type": "Product",
        "name": product.name,
        "image": displayImage ? urlFor(displayImage).url() : "",
        "description": product.metaDescription || product.shortDescription,
        "brand": { "@type": "Brand", "name": "RENW" },
        "sku": product.sku || product._id,
        "mpn": product._id,
        "category": product.category?.name || "Électronique",
        "offers": {
          "@type": "Offer",
          "url": `https://renw.fr/${product.slug?.current}`,
          "price": unitPrice,
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "itemCondition": isReconditioned ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition",
          "seller": { "@type": "Organization", "name": "RENW France" }
        }
      }
    ]
  };

  const onAddToCart = (includeCrossSell = false) => {
    const variantLabel = isReconditioned 
      ? `${product.grades?.[selectedVariant]?.gradeName} - ${product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.storage}`
      : (product.simpleVariants?.[selectedSimpleVar]?.variantName || "Standard");

    cart.addItem({
      _id: `${product._id}-${selectedVariant}-${selectedCap}-${selectedColor}-${selectedSimpleVar}`,
      name: product.name, 
      price: unitPrice, 
      grade: variantLabel,
      color: currentColor || "Original",
      images: [displayImage ? urlFor(displayImage).url() : ""],
      quantity: 1
    });

    if (includeCrossSell && crossSellProduct) {
       cart.addItem({
         _id: crossSellProduct._id,
         name: crossSellProduct.name,
         price: crossSellPrice,
         images: [crossSellProduct.mainImage ? urlFor(crossSellProduct.mainImage).url() : ""],
         quantity: 1
       });
    }

    setShowModal(true);
  };

  const addToCartBtnClass = "bg-[#111111] text-white px-5 md:px-8 py-3.5 md:py-4 rounded-xl text-[12px] md:text-[15px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center shrink-0 min-w-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)]";

  return (
    <main style={siteFont} className="bg-white min-h-screen pb-32 md:pb-24 antialiased text-[#111111] overflow-x-hidden font-normal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {product.headerScript && <Script id="product-js" strategy="afterInteractive">{product.headerScript}</Script>}

      {/* --- MODAL SUCCÈS PANIER --- */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in duration-300 text-[#111111]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><PlusIcon className="w-6 h-6 rotate-45" /></button>
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-full aspect-video relative mb-6 bg-[#F4F9FF] rounded-xl flex items-center justify-center p-4 border border-[#E5F0FF]">
                {displayImage && <Image src={urlFor(displayImage).url()} fill className="object-contain mix-blend-multiply" alt="Succès" />}
              </div>
              <h2 className="text-[24px] mb-2 leading-tight text-[#111111]">Ajouté au panier</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#0066CC] text-[22px]">{unitPrice}€</span>
              </div>
              <div className="w-full flex flex-col gap-3">
                <Link href="/panier" className={addToCartBtnClass}>Passer à la caisse</Link>
                <button onClick={() => setShowModal(false)} className="w-full bg-white border border-[#111111] text-[#111111] py-3.5 md:py-4 rounded-xl text-[13px] md:text-[14px] hover:bg-gray-50 transition-all uppercase tracking-widest">Continuer mes achats</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STICKY BAR MAGIQUE --- */}
      <div className={`fixed bottom-0 left-0 right-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.5,0,0.2,1)] ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between gap-3 w-full box-border">
          <div className="hidden md:flex items-center gap-4">
            <div className="w-12 h-12 relative bg-gray-50 rounded-lg p-0 overflow-hidden border border-gray-100">
              {displayImage && <Image src={urlFor(displayImage).url()} fill className="object-cover mix-blend-multiply" alt="" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] leading-tight line-clamp-1 max-w-[300px] text-[#111111]">{product.name}</span>
              <span className="text-[13px] text-[#111111] opacity-70">{currentColor || 'Standard'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 md:gap-6 min-w-0">
            <div className="flex flex-col text-left md:text-right shrink-0">
              <span className="text-[22px] md:text-[26px] text-[#111111] leading-none">{unitPrice}€</span>
              {priceWhenNew > 0 && <span className="text-[12px] text-[#111111] opacity-60 line-through mt-0.5">Neuf: {priceWhenNew}€</span>}
            </div>
            <button onClick={() => onAddToCart(false)} className={addToCartBtnClass}>
              <ShoppingCartIcon /> <span className="truncate">Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
        
        {/* FIL D'ARIANE DESKTOP */}
        <nav aria-label="Fil d'Ariane" className="hidden md:block mb-6 text-[13px] text-[#111111] opacity-60">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:opacity-100 transition-colors">Accueil</Link></li>
            <ChevronRight size={14} className="stroke-1" />
            {product.category && (
              <>
                <li><Link href={`/categories/${product.category.slug?.current || ""}`} className="hover:opacity-100 transition-colors">{product.category.title || product.category.name}</Link></li>
                <ChevronRight size={14} className="stroke-1" />
              </>
            )}
            <li className="truncate max-w-[200px] opacity-100" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* --- GRILLE PRODUIT PRINCIPALE --- */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-12 items-start">
          
          {/* COLONNE GAUCHE : IMAGES CAROUSEL */}
          <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 relative w-full overflow-hidden">
             
             {/* Fil d'Ariane Mobile */}
             <div className="md:hidden mb-4 text-[12px] text-[#111111] opacity-60 flex items-center gap-1">
                <Link href="/">Accueil</Link>
                <ChevronRight size={12} className="stroke-1" />
                <span className="truncate opacity-100">{product.category?.title || product.category?.name || "Produit"}</span>
             </div>

             {/* Affichage Mobile : Carrousel Swipe */}
             <div className="md:hidden w-full relative -mx-4 px-4 overflow-hidden">
               <ul className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-3 pb-3">
                 {allImages.map((img: any, i: number) => (
                   <li key={i} className="snap-center shrink-0 w-[85vw] aspect-square relative rounded-[1.5rem] overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center p-4">
                     {img && (
                       // Image occupée à 90% sur Mobile
                       <div className="relative w-[90%] h-[90%]">
                         <Image src={urlFor(img).url()} alt={img.alt || product.name} fill priority={i === 0} className="object-contain mix-blend-multiply" sizes="85vw" />
                       </div>
                     )}
                   </li>
                 ))}
               </ul>
             </div>

             {/* Affichage Desktop : 1 Grande Image + Petites Miniatures */}
             <div className="hidden md:flex flex-col gap-4">
                <div className="w-full aspect-square bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center p-10 relative">
                   {/* Image occupée à 75% sur PC */}
                   <div className="relative w-[75%] h-[75%]">
                      <Image src={urlFor(allImages[selectedImageIdx] || allImages[0]).url()} fill className="object-contain mix-blend-multiply" alt=""/>
                   </div>
                </div>
                
                {/* Miniatures très réduites avec flex-wrap pour ne pas casser la page */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 flex-wrap pb-2">
                    {allImages.map((img: any, i: number) => (
                       <button key={i} onClick={() => setSelectedImageIdx(i)} className={`w-14 h-14 shrink-0 rounded-xl bg-white p-2 border transition-all ${selectedImageIdx === i ? 'border-[#0066CC] shadow-md' : 'border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:border-gray-300'}`}>
                         <div className="relative w-full h-full">
                            <Image src={urlFor(img).url()} fill className="object-contain mix-blend-multiply" alt=""/>
                         </div>
                       </button>
                    ))}
                  </div>
                )}
             </div>

          </div>

          {/* COLONNE DROITE : INFOS, ACHAT, OPTIONS */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col w-full overflow-hidden max-w-full box-border">
            
            {/* 1. Titre H1 (Noir) */}
            <div className="mb-4">
              <h1 className="text-[26px] md:text-[32px] leading-tight text-[#111111] mb-1">
                {product.name}
              </h1>
              <div className="text-[14px] text-[#111111] opacity-70">
                {isReconditioned ? product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.storage : ""} {isReconditioned && currentColor && "•"} {currentColor}
              </div>
            </div>

            {/* 2. BLOC PRIX & ACHAT (Hauteur -30%, Fond blanc avec ombre) */}
            <div className="bg-white rounded-2xl p-3 md:p-4 mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-row items-center justify-between gap-3 w-full box-border">
              <div className="flex flex-col gap-0 shrink-0">
                <span className="text-[26px] md:text-[32px] leading-none text-[#111111]">{unitPrice}€</span>
                {priceWhenNew > 0 && <span className="text-[12px] md:text-[13px] text-[#111111] opacity-60 line-through mt-0.5">Neuf {priceWhenNew}€</span>}
                {savings > 0 && (
                  <span className="text-[#0A5C2F] text-[10px] mt-1 px-1.5 py-0.5 rounded border border-[#0A5C2F]/20 bg-[#D9EFD5]/40 w-fit">
                    Éco {savings.toFixed(2)}€
                  </span>
                )}
              </div>
              <button ref={addToCartRef} onClick={() => onAddToCart(false)} className={addToCartBtnClass}>
                <ShoppingCartIcon /> <span className="truncate">Ajouter au panier</span>
              </button>
            </div>

            {/* 3. BUNDLE / CROSS-SELL (Le fameux bouton Bleu) */}
            {crossSellProduct && (
              <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full box-border">
                <h3 className="text-[14px] mb-3 text-[#111111]">Souvent achetés ensemble</h3>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 shrink-0 bg-[#F5F5F7] rounded-lg relative overflow-hidden p-1.5">
                     {displayImage && <Image src={urlFor(displayImage).url()} fill className="object-contain mix-blend-multiply" alt="Produit principal" />}
                  </div>
                  <Plus className="text-[#111111] shrink-0 opacity-40" size={16} />
                  <div className="w-12 h-12 shrink-0 bg-[#F5F5F7] rounded-lg relative overflow-hidden p-1.5">
                     {crossSellProduct.mainImage && <Image src={urlFor(crossSellProduct.mainImage).url()} fill className="object-contain mix-blend-multiply" alt={crossSellProduct.name} />}
                  </div>
                  <div className="flex flex-col ml-1 min-w-0 flex-1">
                     <span className="text-[12px] md:text-[13px] leading-tight line-clamp-2 text-[#111111] break-words">{crossSellProduct.name}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-row items-center justify-between gap-2 flex-wrap w-full">
                   <div className="text-[13px] text-[#111111]">Total: <span>{bundlePrice}€</span></div>
                   <button onClick={() => onAddToCart(true)} className="bg-[#0066CC] text-white py-2.5 px-4 rounded-xl text-[11px] md:text-[12px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center shrink-0 whitespace-nowrap shadow-md shadow-blue-200">
                     <ShoppingCartIcon className="w-4 h-4 mr-1.5 text-white" /> L'ensemble
                   </button>
                </div>
              </div>
            )}

            {/* 4. OPTIONS EN TUILES (Ombre Bleutée, Texte Noir) */}
            <div className="space-y-5 mb-6 w-full box-border">
              {isReconditioned ? (
                <>
                  <fieldset className="w-full">
                    <legend className="text-[15px] mb-2 text-[#111111]">Condition</legend>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {product.grades?.map((g: any, i: number) => {
                        const gradePrice = g.capacities?.[selectedCap]?.price || 0;
                        return (
                          <label key={i} className="group relative block cursor-pointer w-full">
                            <input type="radio" name="grade" className="peer sr-only" checked={selectedVariant === i} onChange={() => { setSelectedVariant(i); setSelectedCap(0); }} />
                            <div className="h-full w-full rounded-xl border border-transparent bg-white p-3 transition-all hover:shadow-[0_4px_15px_rgba(0,102,204,0.12)] peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
                              <span className="text-[13px] md:text-[14px] text-[#111111] leading-tight mb-1 break-words w-full">{g.gradeName}</span>
                              <span className="text-[12px] text-[#111111] mb-1">{gradePrice}€</span>
                              {g.gradeDescription && <span className="text-[10px] text-[#111111] opacity-60 leading-tight line-clamp-2">{g.gradeDescription}</span>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="w-full">
                    <legend className="text-[15px] mb-2 text-[#111111]">Capacité</legend>
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {product.grades?.[selectedVariant]?.capacities?.map((cap: any, i: number) => (
                        <label key={i} className="group relative block cursor-pointer w-full">
                          <input type="radio" name="storage" className="peer sr-only" checked={selectedCap === i} onChange={() => setSelectedCap(i)} />
                          <div className="h-14 w-full rounded-xl border border-transparent bg-white p-1 transition-all hover:shadow-[0_4px_15px_rgba(0,102,204,0.12)] peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
                            <span className="text-[13px] md:text-[14px] text-[#111111] leading-none mb-1 break-words">{cap.storage}</span>
                            <span className="text-[11px] md:text-[12px] text-[#111111] leading-none">{cap.price}€</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              ) : (
                product.simpleVariants && product.simpleVariants.length > 0 && (
                  <fieldset className="w-full">
                    <legend className="text-[15px] mb-2 text-[#111111]">Modèle</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      {product.simpleVariants.map((v: any, i: number) => (
                        <label key={i} className="group relative block cursor-pointer w-full">
                          <input type="radio" name="variant" className="peer sr-only" checked={selectedSimpleVar === i} onChange={() => setSelectedSimpleVar(i)} />
                          <div className="rounded-xl border border-transparent bg-white p-3 transition-all hover:shadow-[0_4px_15px_rgba(0,102,204,0.12)] peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
                            <span className="text-[14px] text-[#111111] mb-1">{v.variantName}</span>
                            <span className="text-[13px] text-[#111111]">{v.price}€</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )
              )}

              {safeColors.length > 0 && (
                <fieldset className="w-full">
                  <legend className="text-[15px] mb-2 text-[#111111]">Couleur</legend>
                  <div className="grid grid-cols-4 gap-2 md:gap-3 w-full">
                    {safeColors.map((color: string, i: number) => (
                      <label key={i} className="group relative block cursor-pointer w-full">
                        <input type="radio" name="color" className="peer sr-only" checked={selectedColor === i} onChange={() => { setSelectedColor(i); setUserHasSelectedColor(true); }} />
                        <div className="h-10 w-full rounded-xl border border-transparent bg-white px-0.5 transition-all hover:shadow-[0_4px_15px_rgba(0,102,204,0.12)] peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-center">
                          <span className="text-[10px] md:text-[12px] text-[#111111] leading-tight break-words">{color}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>

            {/* 5. RÉASSURANCE (Bleu Très Très Clair) */}
            {product.productFeatures && product.productFeatures.length > 0 && (
              <div className="flex flex-col gap-2 mt-4 w-full box-border">
                {product.productFeatures.map((feature: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#F8FBFF] p-3 md:p-4 rounded-xl border border-[#E5F0FF] w-full shadow-sm">
                    {feature.iconImage ? (
                      <div className="w-6 h-6 relative shrink-0">
                        <Image src={urlFor(feature.iconImage).url()} alt="" fill className="object-contain" />
                      </div>
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center text-[16px] shrink-0 text-[#111111]">{feature.icon || "✓"}</span>
                    )}
                    <span className="text-[13px] md:text-[14px] text-[#111111] leading-snug break-words flex-1">{feature.text}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* --- SECTION BASSE (ORDRE: 1. Desc 2. Specs 3. FAQ) --- */}
        <div className="mt-16 md:mt-24 max-w-4xl border-t border-gray-200 pt-12 md:pt-16">
          
          {/* 1. Description */}
          {product.content && (
            <div className="mb-12">
               <h3 className="text-[20px] md:text-[24px] mb-6 text-[#111111]">Description détaillée</h3>
               <div className="prose max-w-none text-[#111111] text-[14px] md:text-[15px] leading-relaxed font-normal">
                 <PortableText value={product.content} />
               </div>
            </div>
          )}

          {/* 2. Spécifications techniques (Format Liste Claire et Non Déformable) */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-12">
              <h3 className="text-[20px] md:text-[24px] mb-6 text-[#111111]">Spécifications techniques</h3>
              <div className="flex flex-col border-t border-gray-200">
                {product.specifications.map((spec: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 py-4 gap-1">
                    <span className="text-[14px] md:text-[15px] text-[#111111] font-medium w-full sm:w-1/3">{spec.label}</span>
                    <span className="text-[14px] md:text-[15px] text-[#111111] sm:text-right w-full sm:w-2/3">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FAQ Accordéon */}
          {product.faq && product.faq.length > 0 && (
            <div className="mb-12">
              <h3 className="text-[20px] md:text-[24px] mb-6 text-[#111111]">Questions fréquentes</h3>
              <div className="space-y-3">
                {product.faq.map((item: any, i: number) => (
                  <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm transition-all">
                    <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 text-[14px] md:text-[15px] text-[#111111] outline-none font-normal">
                      {item.question}
                      <span className="transition duration-300 group-open:rotate-45 ml-4 shrink-0 bg-[#F5F5F7] p-2 rounded-full text-[#111111]">
                        <PlusIcon className="w-5 h-5" />
                      </span>
                    </summary>
                    <div className="px-4 md:px-5 pb-5 pt-0">
                      <p className="text-[#111111] text-[13px] md:text-[14px] leading-relaxed font-normal">{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}