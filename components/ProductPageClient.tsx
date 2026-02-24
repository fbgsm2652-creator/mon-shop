"use client";
import { useState, useEffect, useRef } from "react";
import { PortableText } from "@portabletext/react";
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ChevronRight, Plus, X, Info } from "lucide-react";

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
  
  // Nouveaux états pour le Volet "Détails de l'état"
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [viewedGrade, setViewedGrade] = useState<any>(null);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
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

  // 🔥 GESTION DES VENTES CROISÉES MULTIPLES (Pack) 🔥
  const crossSellProducts = Array.isArray(product.crossSell) ? product.crossSell : (product.crossSell ? [product.crossSell] : []);
  
  const validCrossSells = crossSellProducts.map((cs: any) => {
      let p = 0;
      if (cs.isReconditioned) p = cs.grades?.[0]?.capacities?.[0]?.price || 0;
      else if (cs.simpleVariants && cs.simpleVariants.length > 0) p = cs.simpleVariants[0]?.price || 0;
      else p = cs.price || 0;
      return { ...cs, computedPrice: p };
  }).filter((cs: any) => cs.computedPrice > 0);

  const totalCrossSellPrice = validCrossSells.reduce((acc: number, curr: any) => acc + curr.computedPrice, 0);
  const bundlePrice = unitPrice + totalCrossSellPrice;

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

    if (includeCrossSell && validCrossSells.length > 0) {
       validCrossSells.forEach((cs: any) => {
           cart.addItem({
             _id: cs._id,
             name: cs.name,
             price: cs.computedPrice,
             images: [cs.mainImage ? urlFor(cs.mainImage).url() : ""],
             quantity: 1
           });
       });
    }

    setShowModal(true);
  };

  const onAddSingleCrossSell = (cs: any) => {
    cart.addItem({
      _id: cs._id,
      name: cs.name,
      price: cs.computedPrice,
      images: [cs.mainImage ? urlFor(cs.mainImage).url() : ""],
      quantity: 1
    });
  };

  const addToCartBtnClass = "bg-[#111111] text-white px-5 md:px-8 py-3.5 md:py-4 rounded-xl text-[12px] md:text-[15px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center shrink-0 min-w-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)]";

  return (
    <main style={siteFont} className="bg-white min-h-screen pb-32 md:pb-24 antialiased text-[#111111] overflow-x-hidden font-normal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {product.headerScript && <Script id="product-js" strategy="afterInteractive">{product.headerScript}</Script>}

      {/* 🔥 VOLET LATÉRAL (DRAWER) POUR DÉTAILS DE L'ÉTAT 🔥 */}
      <>
        {/* Overlay sombre en arrière-plan */}
        <div 
          className={`fixed inset-0 bg-[#111111]/40 backdrop-blur-sm z-[2500] transition-opacity duration-500 ${infoDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
          onClick={() => setInfoDrawerOpen(false)}
        />
        {/* Le Volet qui glisse de la gauche */}
        <div className={`fixed top-[60px] md:top-[128px] left-0 bottom-0 w-[90%] sm:w-[400px] md:w-[450px] bg-white z-[2501] shadow-[30px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.5,0,0.2,1)] flex flex-col ${infoDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* En-tête du volet */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC]">
             <h3 className="text-[18px] font-black tracking-tight text-[#111111] uppercase">Guide d'information</h3>
             {/* 🔥 CORRECTION ACCESSIBILITÉ : aria-label ajouté 🔥 */}
             <button onClick={() => setInfoDrawerOpen(false)} aria-label="Fermer le guide" className="p-2 hover:bg-gray-200 bg-white shadow-sm rounded-full transition-colors text-gray-600">
               <X size={20}/>
             </button>
          </div>
          
          {/* Contenu du volet */}
          <div className="flex-1 overflow-y-auto p-6">
             {viewedGrade && (
               <div className="flex flex-col items-center">
                 {/* Petite photo du produit */}
                 <div className="w-32 h-32 relative bg-white border border-gray-100 rounded-2xl p-3 shadow-sm mb-6">
                   {displayImage && <Image src={urlFor(displayImage).url()} fill sizes="128px" className="object-contain mix-blend-multiply" alt={product.name} />}
                 </div>
                 
                 {/* Ligne de séparation */}
                 <div className="w-16 h-1 bg-[#0066CC] rounded-full mb-6" />

                 {/* Titre dynamique */}
                 <h4 className="text-[22px] font-black text-center text-[#111111] mb-4 leading-tight">
                   {product.name} <br/>
                   <span className="text-[#0066CC] font-bold text-[18px]">{viewedGrade.gradeName}</span>
                 </h4>

                 {/* Texte descriptif SEO */}
                 <div className="text-[15px] text-gray-600 font-medium text-center mb-8 leading-relaxed">
                   <p>{viewedGrade.drawerDescription || viewedGrade.gradeDescription || "Nos experts ont rigoureusement testé et validé cet appareil pour vous garantir des performances optimales."}</p>
                 </div>

                 {/* Arguments de rassurance */}
                 <div className="w-full space-y-4 bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
                   {(viewedGrade.drawerChecklist && viewedGrade.drawerChecklist.length > 0) ? (
                     viewedGrade.drawerChecklist.map((point: string, idx: number) => (
                       <div key={idx} className="flex items-start gap-3">
                         <span className="text-[#0066CC] mt-0.5 font-black text-[16px]">✓</span>
                         <p className="text-[14px] font-bold text-[#111111]">{point}</p>
                       </div>
                     ))
                   ) : (
                     <>
                       <div className="flex items-start gap-3">
                         <span className="text-[#0066CC] mt-0.5 font-black text-[16px]">✓</span>
                         <p className="text-[14px] font-bold text-[#111111]">100% Fonctionnel</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="text-[#0066CC] mt-0.5 font-black text-[16px]">✓</span>
                         <p className="text-[14px] font-bold text-[#111111]">Testé sur plus de 40 points de contrôle</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="text-[#0066CC] mt-0.5 font-black text-[16px]">✓</span>
                         <p className="text-[14px] font-bold text-[#111111]">Nettoyage et désinfection complète</p>
                       </div>
                     </>
                   )}
                 </div>
               </div>
             )}
          </div>

          {/* Bouton de fermeture en bas */}
          <div className="p-6 border-t border-gray-100 bg-white">
             <button onClick={() => setInfoDrawerOpen(false)} className="w-full bg-[#111111] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[13px] shadow-lg hover:bg-[#0066CC] transition-all">
               J'ai compris
             </button>
          </div>
        </div>
      </>

      {/* 🔥 POPUP AJOUT PANIER 🔥 */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in duration-300 text-[#111111]">
            {/* 🔥 CORRECTION ACCESSIBILITÉ : aria-label ajouté 🔥 */}
            <button aria-label="Fermer la notification d'ajout au panier" onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><PlusIcon className="w-6 h-6 rotate-45" /></button>
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-full aspect-video relative mb-6 bg-[#F4F9FF] rounded-xl flex items-center justify-center p-4 border border-[#E5F0FF]">
                {displayImage && <Image src={urlFor(displayImage).url()} fill className="object-contain mix-blend-multiply" alt="Succès" />}
              </div>
              <h2 className="text-[24px] mb-2 leading-tight text-[#111111]">Ajouté au panier</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#0066CC] text-[22px] font-bold">{unitPrice}€</span>
              </div>
              <div className="w-full flex flex-col gap-3">
                <Link href="/panier" className={addToCartBtnClass}>Passer à la caisse</Link>
                <button onClick={() => setShowModal(false)} className="w-full bg-white border border-[#111111] text-[#111111] py-3.5 md:py-4 rounded-xl text-[13px] md:text-[14px] font-bold hover:bg-gray-50 transition-all uppercase tracking-widest">Continuer mes achats</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bar avec sizes="50px" appliqué */}
      <div className={`fixed bottom-0 left-0 right-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.5,0,0.2,1)] ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between gap-3 w-full box-border">
          <div className="hidden md:flex items-center gap-4">
            <div className="w-12 h-12 relative shrink-0 bg-gray-50 rounded-lg p-0 overflow-hidden border border-gray-100">
              {displayImage && <Image src={urlFor(displayImage).url()} fill sizes="50px" className="object-cover mix-blend-multiply" alt="Miniature" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] leading-tight line-clamp-1 max-w-[300px] font-bold text-[#111111]">{product.name}</span>
              <span className="text-[13px] text-[#111111] opacity-70 font-medium">{currentColor || 'Standard'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 md:gap-6 min-w-0">
            <div className="flex flex-col text-left md:text-right shrink-0">
              <span className="text-[22px] md:text-[26px] font-bold text-[#111111] leading-none">{unitPrice}€</span>
              {priceWhenNew > 0 && <span className="text-[12px] text-[#111111] opacity-60 line-through mt-0.5 font-medium">Neuf: {priceWhenNew}€</span>}
            </div>
            <button onClick={() => onAddToCart(false)} className={addToCartBtnClass}>
              <ShoppingCartIcon /> <span className="truncate">Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
        
        <nav aria-label="Fil d'Ariane" className="hidden md:block mb-6 text-[13px] text-[#111111] opacity-60 font-medium">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:opacity-100 transition-colors">Accueil</Link></li>
            <ChevronRight size={14} className="stroke-1" />
            {product.category && (
              <>
                <li><Link href={`/${product.category.slug?.current || product.category.slug || ""}`} className="hover:opacity-100 transition-colors">{product.category.title || product.category.name}</Link></li>
                <ChevronRight size={14} className="stroke-1" />
              </>
            )}
            <li className="truncate max-w-[200px] opacity-100" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-12 items-start">
          
          <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 relative w-full overflow-hidden">
             
             <div className="md:hidden mb-4 text-[12px] text-[#111111] font-medium opacity-60 flex items-center gap-1">
                <Link href="/">Accueil</Link>
                <ChevronRight size={12} className="stroke-1" />
                <span className="truncate opacity-100">{product.category?.title || product.category?.name || "Produit"}</span>
             </div>

             <div className="md:hidden w-full relative -mx-4 px-4 overflow-hidden">
               <ul className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-3 pb-3">
                 {allImages.map((img: any, i: number) => (
                   <li key={i} className="snap-center shrink-0 w-[85vw] aspect-square relative rounded-[1.5rem] overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center p-4">
                     {img && (
                       <div className="relative w-[90%] h-[90%]">
                         {/* 🔥 CORRECTION PERFORMANCE : sizes plus petits sur mobile 🔥 */}
                         <Image src={typeof img === 'string' ? img : urlFor(img).url()} alt={img.alt || product.name} fill priority={i === 0} fetchPriority={i === 0 ? "high" : "auto"} className="object-contain mix-blend-multiply" sizes="(max-width: 768px) 85vw, 50vw" />
                       </div>
                     )}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="hidden md:flex flex-col gap-4">
                <div className="w-full aspect-square bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center p-10 relative">
                   <div className="relative w-[75%] h-[75%]">
                      <Image 
                        src={typeof (allImages[selectedImageIdx] || allImages[0]) === 'string' ? (allImages[selectedImageIdx] || allImages[0]) : urlFor(allImages[selectedImageIdx] || allImages[0]).url()} 
                        fill 
                        priority 
                        fetchPriority="high" 
                        sizes="(max-width: 768px) 100vw, 50vw" 
                        className="object-contain mix-blend-multiply" 
                        alt={product.name || "Produit RENW"}
                      />
                   </div>
                </div>
                
                {allImages.length > 1 && (
                  <div className="flex gap-3 flex-wrap pb-2">
                    {allImages.map((img: any, i: number) => (
                       /* 🔥 CORRECTION ACCESSIBILITÉ : aria-label ajouté pour les boutons miniatures 🔥 */
                       <button key={i} aria-label={`Voir l'image ${i + 1}`} onClick={() => setSelectedImageIdx(i)} className={`w-14 h-14 shrink-0 rounded-xl bg-white p-2 border transition-all ${selectedImageIdx === i ? 'border-[#0066CC] shadow-md' : 'border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:border-gray-300'}`}>
                         <div className="relative w-full h-full">
                            {/* 🔥 CORRECTION PERFORMANCE : sizes="60px" pour ces petites images 🔥 */}
                            <Image src={typeof img === 'string' ? img : urlFor(img).url()} fill sizes="60px" className="object-contain mix-blend-multiply" alt=""/>
                         </div>
                       </button>
                    ))}
                  </div>
                )}
             </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 flex flex-col w-full overflow-hidden max-w-full box-border">
            
            <div className="mb-4">
              <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight leading-tight text-[#111111] mb-1">
                {product.name}
              </h1>
              <div className="text-[14px] font-medium text-[#111111] opacity-70">
                {isReconditioned ? product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.storage : ""} {isReconditioned && currentColor && "•"} {currentColor}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 md:p-4 mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-row items-center justify-between gap-3 w-full box-border">
              <div className="flex flex-col gap-0 shrink-0">
                <span className="text-[26px] md:text-[32px] font-bold leading-none text-[#111111]">{unitPrice}€</span>
                {priceWhenNew > 0 && <span className="text-[12px] md:text-[13px] text-[#111111] opacity-60 font-medium line-through mt-0.5">Neuf {priceWhenNew}€</span>}
                {savings > 0 && (
                  <span className="text-[#0A5C2F] font-bold text-[10px] mt-1 px-2 py-0.5 rounded-md border border-[#0A5C2F]/20 bg-[#D9EFD5]/40 w-fit">
                    Éco {savings.toFixed(2)}€
                  </span>
                )}
              </div>
              <button ref={addToCartRef} onClick={() => onAddToCart(false)} className={addToCartBtnClass}>
                <ShoppingCartIcon /> <span className="truncate">Ajouter au panier</span>
              </button>
            </div>

            {validCrossSells.length > 0 && (
              <div className="mb-6 bg-white border border-[#E5F0FF] rounded-2xl p-4 md:p-5 shadow-[0_10px_40px_rgba(0,102,204,0.05)] w-full box-border">
                <h2 className="text-[16px] md:text-[18px] mb-4 text-[#111111] font-bold tracking-tight">Souvent achetés ensemble</h2>
                
                <div className="flex flex-col gap-3 mb-5">
                  {validCrossSells.map((cs: any, index: number) => (
                    <div key={cs._id || index} className="flex items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 transition-colors hover:border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-white rounded-lg relative overflow-hidden p-1.5 border border-gray-100 shadow-sm">
                           {/* 🔥 CORRECTION ACCESSIBILITÉ : aria-hidden ajouté 🔥 */}
                           {cs.mainImage && <Image src={typeof cs.mainImage === 'string' ? cs.mainImage : urlFor(cs.mainImage).url()} fill sizes="60px" className="object-contain mix-blend-multiply" alt="" aria-hidden="true" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] md:text-[14px] font-bold text-[#111111] leading-tight line-clamp-2">{cs.name}</span>
                          <span className="text-[12px] md:text-[13px] text-[#0066CC] font-bold">{cs.computedPrice}€</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onAddSingleCrossSell(cs)} 
                        aria-label={`Ajouter ${cs.name}`}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-[#111111] hover:bg-[#0066CC] hover:text-white hover:border-[#0066CC] transition-colors shrink-0 shadow-sm"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-row items-center justify-between gap-2 flex-wrap w-full">
                   <div className="text-[13px] md:text-[14px] text-[#111111] font-medium">Prix total (Pack): <span className="font-bold text-[18px] md:text-[20px] text-[#0066CC] block md:inline md:ml-2">{bundlePrice}€</span></div>
                   
                   <button onClick={() => onAddToCart(true)} className="bg-[#0066CC] hover:opacity-90 text-white py-3 px-5 rounded-xl text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center shrink-0 whitespace-nowrap shadow-lg shadow-blue-200">
                     <ShoppingCartIcon className="w-4 h-4 mr-1.5 text-white" /> Tout Ajouter
                   </button>
                </div>
              </div>
            )}

            <div className="space-y-6 mb-6 w-full box-border">
              {isReconditioned ? (
                <>
                  <fieldset className="w-full">
                    <legend className="text-[16px] md:text-[18px] font-bold mb-3 text-[#111111] tracking-tight">Condition</legend>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {product.grades?.map((g: any, i: number) => {
                        const gradePrice = g.capacities?.[selectedCap]?.price || 0;
                        return (
                          <label key={i} className="group relative block cursor-pointer w-full">
                            <input type="radio" name="grade" className="peer sr-only" checked={selectedVariant === i} onChange={() => { setSelectedVariant(i); setSelectedCap(0); }} />
                            
                            <div className="h-full w-full rounded-xl border-2 border-transparent bg-[#F8FAFC] p-3 md:p-4 transition-all hover:shadow-md peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-sm flex flex-col items-center justify-center text-center relative">
                              
                              <span className="text-[14px] md:text-[16px] font-bold text-[#111111] leading-tight mb-1 break-words w-full">{g.gradeName}</span>
                              <span className="text-[13px] md:text-[14px] font-semibold text-gray-700 mb-1">{gradePrice}€</span>
                              {g.gradeDescription && <span className="text-[11px] text-gray-500 font-medium leading-tight line-clamp-2 mt-1">{g.gradeDescription}</span>}

                              {/* 🔥 BOUTON DÉTAILS - Position exacte à 3px des bords 🔥 */}
                              <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewedGrade({ ...g, gradeName: g.gradeName }); setInfoDrawerOpen(true); }}
                                className="absolute bottom-[3px] right-[3px] text-[#0066CC] hover:bg-[#0066CC] hover:text-white flex items-center gap-1 bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm border border-[#0066CC]/20 transition-all z-10"
                              >
                                <Info size={12} strokeWidth={2.5} />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">Détails</span>
                              </button>

                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="w-full">
                    <legend className="text-[16px] md:text-[18px] font-bold mb-3 text-[#111111] tracking-tight">Capacité</legend>
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {product.grades?.[selectedVariant]?.capacities?.map((cap: any, i: number) => (
                        <label key={i} className="group relative block cursor-pointer w-full">
                          <input type="radio" name="storage" className="peer sr-only" checked={selectedCap === i} onChange={() => setSelectedCap(i)} />
                          <div className="min-h-[44px] md:min-h-[48px] w-full rounded-xl border-2 border-transparent bg-[#F8FAFC] py-1.5 px-1 transition-all hover:shadow-md peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-sm flex flex-col items-center justify-center text-center leading-tight">
                            <span className="text-[13px] md:text-[15px] font-bold text-[#111111] leading-none mb-1 break-words">{cap.storage}</span>
                            <span className="text-[11px] md:text-[12px] font-semibold text-gray-600 leading-none">{cap.price}€</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              ) : (
                product.simpleVariants && product.simpleVariants.length > 0 && (
                  <fieldset className="w-full">
                    <legend className="text-[16px] md:text-[18px] font-bold mb-3 text-[#111111] tracking-tight">Modèle</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      {product.simpleVariants.map((v: any, i: number) => (
                        <label key={i} className="group relative block cursor-pointer w-full">
                          <input type="radio" name="variant" className="peer sr-only" checked={selectedSimpleVar === i} onChange={() => setSelectedSimpleVar(i)} />
                          
                          <div className="h-full w-full rounded-xl border-2 border-transparent bg-[#F8FAFC] p-3 md:p-4 transition-all hover:shadow-md peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-sm flex flex-col items-center justify-center text-center relative">
                            <span className="text-[15px] md:text-[16px] font-bold text-[#111111] mb-1.5">{v.variantName}</span>
                            <span className="text-[13px] md:text-[14px] font-semibold text-gray-600">{v.price}€</span>

                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewedGrade({ gradeName: v.variantName, drawerDescription: v.drawerDescription, drawerChecklist: v.drawerChecklist }); setInfoDrawerOpen(true); }}
                              className="absolute bottom-[3px] right-[3px] text-[#0066CC] hover:bg-[#0066CC] hover:text-white flex items-center gap-1 bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm border border-[#0066CC]/20 transition-all z-10"
                            >
                              <Info size={12} strokeWidth={2.5} />
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">Détails</span>
                            </button>

                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )
              )}

              {safeColors.length > 0 && (
                <fieldset className="w-full">
                  <legend className="text-[16px] md:text-[18px] font-bold mb-3 text-[#111111] tracking-tight">Couleur</legend>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 w-full">
                    {safeColors.map((color: string, i: number) => (
                      <label key={i} className="group relative block cursor-pointer w-full">
                        <input type="radio" name="color" className="peer sr-only" checked={selectedColor === i} onChange={() => { setSelectedColor(i); setUserHasSelectedColor(true); }} />
                        <div className="min-h-[44px] md:min-h-[48px] w-full rounded-xl border-2 border-transparent bg-[#F8FAFC] px-2 py-1.5 transition-all hover:shadow-md peer-checked:border-[#0066CC] peer-checked:bg-[#F4F9FF] peer-checked:shadow-[0_4px_15px_rgba(0,102,204,0.2)] shadow-sm flex items-center justify-center text-center">
                          <span className="text-[13px] md:text-[14px] font-bold text-[#111111] leading-tight break-words">{color}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>

            {product.productFeatures && product.productFeatures.length > 0 && (
              <div className="flex flex-col gap-2 mt-4 w-full box-border">
                {product.productFeatures.map((feature: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#F8FBFF] p-3 md:p-4 rounded-xl border border-[#E5F0FF] w-full shadow-sm">
                    {feature.iconImage ? (
                      <div className="w-6 h-6 relative shrink-0">
                        {/* 🔥 CORRECTION PERFORMANCE : sizes="24px" ajouté 🔥 */}
                        <Image src={urlFor(feature.iconImage).url()} alt="" fill sizes="24px" className="object-contain" />
                      </div>
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center text-[16px] shrink-0 text-[#111111]">{feature.icon || "✓"}</span>
                    )}
                    <span className="text-[13px] md:text-[14px] font-medium text-[#111111] leading-snug break-words flex-1">{feature.text}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        <div className="mt-16 md:mt-24 max-w-4xl border-t border-gray-200 pt-12 md:pt-16">
          
          {product.content && (
            <div className="mb-12">
               <h2 className="text-[20px] md:text-[24px] mb-6 text-[#111111] font-bold">Description détaillée</h2>
               <div className="prose max-w-none text-[#111111] text-[14px] md:text-[15px] leading-relaxed font-normal">
                 <PortableText value={product.content} />
               </div>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[20px] md:text-[24px] mb-6 text-[#111111] font-bold">Spécifications techniques</h2>
              <div className="flex flex-col border-t border-gray-200">
                {product.specifications.map((spec: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 py-4 gap-1">
                    <span className="text-[14px] md:text-[15px] text-[#111111] font-bold w-full sm:w-1/3">{spec.label}</span>
                    <span className="text-[14px] md:text-[15px] text-gray-700 font-medium sm:text-right w-full sm:w-2/3">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.faq && product.faq.length > 0 && (
            <div className="mb-12">
              <h2 className="text-[20px] md:text-[24px] mb-6 text-[#111111] font-bold">Questions fréquentes</h2>
              <div className="space-y-3">
                {product.faq.map((item: any, i: number) => (
                  <details key={i} className="group bg-[#F8FAFC] rounded-xl border border-gray-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm transition-all">
                    <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 text-[14px] md:text-[15px] font-bold text-[#111111] outline-none">
                      {item.question}
                      <span className="transition duration-300 group-open:rotate-45 ml-4 shrink-0 bg-white p-2 rounded-full text-[#111111] shadow-sm">
                        <PlusIcon className="w-5 h-5" />
                      </span>
                    </summary>
                    <div className="px-4 md:px-5 pb-5 pt-0">
                      <p className="text-gray-700 font-medium text-[13px] md:text-[14px] leading-relaxed">{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 SEO MAILLAGE VERTICAL : Dans la même catégorie 🔥 */}
        {product.category?.relatedProducts && product.category.relatedProducts.filter((p:any) => p._id !== product._id).length > 0 && (
          <div className="mt-16 md:mt-24 border-t border-gray-200 pt-16 md:pt-20">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-[22px] md:text-[28px] font-[1000] tracking-tighter text-[#111111] uppercase">
                Dans la même catégorie
              </h2>
              <p className="text-gray-500 text-[14px] mt-2 font-medium">Découvrez toutes nos pièces et appareils associés pour {product.category.title}.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
              {product.category.relatedProducts.filter((p:any) => p._id !== product._id).slice(0, 4).map((p: any) => (
                <article key={p._id} className="h-full">
                  <Link href={`/${p.slug}`} className="group block text-center bg-white border border-gray-100 rounded-[1.5rem] p-4 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 h-full flex flex-col">
                    <div className="aspect-square bg-[#F5F5F7] rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3 relative">
                      {p.mainImage && (
                        <div className="relative w-[75%] h-[75%]">
                          <Image 
                            src={typeof p.mainImage === 'string' ? p.mainImage : urlFor(p.mainImage).url()} 
                            alt={`Photo de ${p.name}`} 
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-1 space-y-2 flex flex-col flex-grow text-left">
                      {/* 🔥 CORRECTION SÉMANTIQUE : h4 -> h3 🔥 */}
                      <h3 className="text-[12px] md:text-[13px] font-bold text-[#111111] line-clamp-2 leading-tight uppercase">{p.name}</h3>
                      <div className="pt-2 mt-auto w-full flex flex-col">
                        <span className="text-[14px] md:text-[16px] font-[1000] text-[#0066CC] mb-2">{p.minPrice ? `${p.minPrice}€` : "Voir le produit"}</span>
                        <span className="inline-block bg-[#F5F5F7] text-[#111111] px-4 py-2.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest group-hover:bg-[#111111] group-hover:text-white transition-all duration-300 w-full text-center">
                          Découvrir
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 SEO MAILLAGE HORIZONTAL : Les plus convoités (Best Sellers) 🔥 */}
        {product.bestSellers && product.bestSellers.filter((p:any) => p._id !== product._id).length > 0 && (
          <div className="mt-16 md:mt-24 border-t border-gray-200 pt-16 md:pt-20">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-[22px] md:text-[28px] font-[1000] tracking-tighter text-[#111111] uppercase">
                Les plus convoités
              </h2>
              <p className="text-gray-500 text-[14px] mt-2 font-medium">Découvrez les appareils et pièces préférés de nos clients.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
              {product.bestSellers.filter((p:any) => p._id !== product._id).slice(0, 4).map((p: any) => (
                <article key={p._id} className="h-full">
                  <Link href={`/${p.slug}`} className="group block text-center bg-white border border-gray-100 rounded-[1.5rem] p-4 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 h-full flex flex-col">
                    <div className="aspect-square bg-[#F5F5F7] rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3 relative">
                      {p.mainImage && (
                        <div className="relative w-[75%] h-[75%]">
                          <Image 
                            src={typeof p.mainImage === 'string' ? p.mainImage : urlFor(p.mainImage).url()} 
                            alt={`Photo de ${p.name}`} 
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-1 space-y-2 flex flex-col flex-grow text-left">
                      {/* 🔥 CORRECTION SÉMANTIQUE : h4 -> h3 🔥 */}
                      <h3 className="text-[12px] md:text-[13px] font-bold text-[#111111] line-clamp-2 leading-tight uppercase">{p.name}</h3>
                      <div className="pt-2 mt-auto w-full flex flex-col">
                        <span className="text-[14px] md:text-[16px] font-[1000] text-[#0066CC] mb-2">{p.minPrice ? `${p.minPrice}€` : "Voir le produit"}</span>
                        <span className="inline-block bg-[#F5F5F7] text-[#111111] px-4 py-2.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest group-hover:bg-[#111111] group-hover:text-white transition-all duration-300 w-full text-center">
                          Découvrir
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}