"use client";
import { useState } from "react";
import { PortableText } from "@portabletext/react";
import useCart from "@/hooks/use-cart";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image"; // Import ajouté
import Script from "next/script";

/**
 * META KEYWORDS: {product.metaKeywords}, reconditionné, RENW France, {product.name}
 */

// --- ICÔNES ---
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 ${className}`}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);
const ShieldCheck = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>);
const TruckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-70"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-70"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>);
const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MinusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default function ProductPageClient({ product }: { product: any }) {
  const cart = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0); 
  const [selectedCap, setSelectedCap] = useState(0); 
  const [selectedSimpleVar, setSelectedSimpleVar] = useState(0); 
  const [selectedColor, setSelectedColor] = useState(0);
  const [userHasSelectedColor, setUserHasSelectedColor] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const totalPrice = unitPrice * quantity;
  const safeColors = Array.isArray(product.colors) ? product.colors : [];
  const currentColor = safeColors[selectedColor] || "";
  
  const displayImage = !userHasSelectedColor 
    ? (product.mainImage || product.images?.[0]) 
    : (product.images?.find((img: any) => img.colorAssoc === currentColor) || product.mainImage);

  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
  const metaKeywords = `${product.metaKeywords || ""}, reconditionné, RENW France, ${product.name}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
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
      },
      ...(product.faq && product.faq.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": product.faq.map((f: any) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }] : [])
    ]
  };

  const onAddToCart = () => {
    const variantLabel = isReconditioned 
      ? `${product.grades?.[selectedVariant]?.gradeName} - ${product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.storage}`
      : (product.simpleVariants?.[selectedSimpleVar]?.variantName || "Standard");

    cart.addItem({
      _id: `${product._id}-${selectedVariant}-${selectedCap}-${selectedColor}-${selectedSimpleVar}`,
      name: product.name, 
      price: unitPrice, 
      grade: variantLabel,
      color: currentColor || "Original",
      images: [displayImage ? urlFor(displayImage).url() : ""]
    });
    setShowModal(true);
  };

  return (
    <main style={siteFont} className="bg-white min-h-screen pb-32 md:pb-24 antialiased">
      <meta name="keywords" content={metaKeywords} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {product.headerScript && <Script id="product-js" strategy="afterInteractive">{product.headerScript}</Script>}

      {/* MODAL & BARRE MOBILE */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCartIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Ajouté au panier !</h2>
            <p className="text-gray-500 text-sm mb-6">Souhaitez-vous finaliser votre commande maintenant ?</p>
            <div className="flex flex-col gap-3">
              <Link href="/cart" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Voir mon panier</Link>
              <button onClick={() => setShowModal(false)} className="w-full bg-gray-100 text-gray-600 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Continuer mes achats</button>
            </div>
          </div>
        </div>
      )}

      {/* BARRE MOBILE D'ACHAT */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex flex-col min-w-[70px]">
            <span className="text-[18px] font-black text-blue-600 tracking-tighter leading-none">{totalPrice}€</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded-xl h-[50px] px-1 shrink-0">
              <button aria-label="Moins" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 flex items-center justify-center text-gray-500"><MinusIcon /></button>
              <span className="w-5 text-center font-bold text-[12px]">{quantity}</span>
              <button aria-label="Plus" onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500"><PlusIcon /></button>
          </div>
          <button onClick={onAddToCart} className="flex-[2.5] bg-[#111111] text-white h-[50px] rounded-xl font-black uppercase tracking-[0.1em] text-[9px] flex items-center justify-center px-1 shadow-lg active:scale-95 transition-transform">
            <ShoppingCartIcon className="w-3 h-3" /> Ajouter au panier
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 md:pt-5">
        
        {/* FIL D'ARIANE */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <span className="text-[8px] opacity-30">/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug?.current || ""}`} className="hover:text-blue-600 transition-colors">
                {product.category.title || product.category.name}
              </Link>
              <span className="text-[8px] opacity-30">/</span>
            </>
          )}
          <span className="text-gray-900 truncate max-w-[120px]">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-16 items-start">
          <div className="w-full lg:w-3/5 space-y-4 lg:space-y-10">
            <div className="flex flex-col items-center">
              
              <div className="w-[95%] md:w-[80%] mb-4 md:mb-5 p-2 md:p-3 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-gray-100/30 flex flex-col items-center lg:items-center lg:text-center">
                <h1 className="text-[20px] md:text-[26px] font-medium tracking-tight leading-tight text-gray-900">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-2 mt-1 px-3 py-0.5 bg-white shadow-sm rounded-full border border-blue-50/50 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.05em] text-blue-600/60">
                  <span>{isReconditioned ? product.grades?.[selectedVariant]?.capacities?.[selectedCap]?.storage : ""}</span>
                  {isReconditioned && currentColor && <span className="w-1 h-1 bg-gray-200 rounded-full"></span>}
                  <span>{currentColor}</span>
                </div>
              </div>

              {/* IMAGE PRINCIPALE OPTIMISÉE POUR LE 10/10 SEO (LCP) */}
              <div className="w-[95%] md:w-[80%] aspect-square bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center justify-center p-6 md:p-20 relative border border-gray-50">
                {displayImage && (
                  <Image 
                    src={urlFor(displayImage).url()} 
                    alt={`${product.name} ${currentColor || ''} reconditionné certifié RENW France`} 
                    fill
                    priority={true} // Boost de vitesse LCP
                    className="object-contain p-8 md:p-12"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>

            <div className="hidden lg:block space-y-16">
                <div className="w-full h-px bg-gray-100"></div>
                <section aria-labelledby="desc-title">
                   <div className="bg-blue-600 rounded-2xl p-4 mb-8 shadow-lg shadow-blue-200/50">
                     <h2 id="desc-title" className="text-[16px] font-black uppercase tracking-[0.3em] text-white text-center">Description détaillée</h2>
                   </div>
                   <div className="prose prose-blue max-w-none text-gray-600 text-[15px] px-2">
                      <PortableText value={product.content || []} />
                   </div>
                </section>
                
                {product.faq && product.faq.length > 0 && (
                  <section className="border-t border-gray-100 pt-12" aria-labelledby="faq-title">
                     <div className="bg-blue-600 rounded-2xl p-4 mb-8 shadow-lg shadow-blue-200/50">
                       <h2 id="faq-title" className="text-[16px] font-black uppercase tracking-[0.3em] text-white text-center">Questions fréquentes</h2>
                     </div>
                     <div className="space-y-4 px-2">
                       {product.faq.map((item: any, i: number) => (
                         <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-[#FAFAFA]/50 hover:border-blue-100 transition-colors">
                           <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white transition-all">
                             <span className="text-[15px] font-bold text-gray-900">{item.question}</span>
                             <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-45 text-blue-600' : 'text-gray-400'}`}><PlusIcon /></div>
                           </button>
                           <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                             <p className="p-6 pt-0 text-[14px] text-gray-500 leading-relaxed">{item.answer}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                  </section>
                )}
            </div>
          </div>

          <div className="w-full lg:w-2/5 lg:sticky lg:top-8 self-start z-40">
            <div className="bg-[#FAFAFA] rounded-[3rem] p-8 md:p-10 flex flex-col space-y-8 border border-gray-100 transition-all duration-500 ease-out hover:shadow-[0_45px_90px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.02] hover:bg-white group/card">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-8">
                  <div className="text-[32px] md:text-[36px] font-medium text-blue-600 tracking-tighter shrink-0">{totalPrice}€</div>
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-[52px]">
                        <button aria-label="Moins" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"><MinusIcon /></button>
                        <span className="w-6 text-center font-bold text-[13px]">{quantity}</span>
                        <button aria-label="Plus" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"><PlusIcon /></button>
                    </div>
                    <button onClick={onAddToCart} className="flex-grow max-w-[170px] bg-[#111111] text-white h-[52px] rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center active:scale-95">
                      <ShoppingCartIcon /> Ajouter
                    </button>
                  </div>
                </div>
                
                {product.shortDescription && (
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 italic text-gray-600 text-[14px] leading-relaxed shadow-inner">
                    "{product.shortDescription}"
                  </div>
                )}
              </div>
              
              {isReconditioned ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">1. État esthétique</p>
                    <div className="flex flex-wrap gap-2.5">
                      {product.grades?.map((g: any, i: number) => (
                        <button key={i} onClick={() => { setSelectedVariant(i); setSelectedCap(0); }} className={`w-[calc(50%-5px)] md:w-[110px] h-[52px] flex items-center justify-center rounded-xl border-2 text-[12px] font-semibold transition-all ${selectedVariant === i ? 'border-blue-600 bg-white text-blue-600 shadow-md scale-105' : 'border-gray-200 text-gray-500 hover:border-blue-200'}`}>{g.gradeName}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">2. Capacité</p>
                    <div className="flex flex-wrap gap-2.5">
                      {product.grades?.[selectedVariant]?.capacities?.map((cap: any, i: number) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedCap(i)} 
                          className={`min-w-[75px] px-5 py-3.5 rounded-xl border-2 text-[12px] font-bold uppercase transition-all ${selectedCap === i ? 'border-black bg-black text-white shadow-lg scale-105' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}
                        >
                          {cap.storage}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                product.simpleVariants && product.simpleVariants.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Modèle / Qualité</p>
                    <div className="flex flex-wrap gap-2.5">
                      {product.simpleVariants.map((v: any, i: number) => (
                        <button key={i} onClick={() => setSelectedSimpleVar(i)} className={`px-6 h-[52px] flex items-center justify-center rounded-xl border-2 text-[12px] font-semibold transition-all ${selectedSimpleVar === i ? 'border-blue-600 bg-white text-blue-600 shadow-md scale-105' : 'border-gray-200 text-gray-500 hover:border-blue-200'}`}>{v.variantName}</button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {safeColors.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Choisir la couleur</p>
                  <div className="flex flex-wrap gap-3">
                    {safeColors.map((color: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedColor(i); setUserHasSelectedColor(true); }} 
                        className={`px-6 py-3.5 rounded-xl border-2 text-[13px] font-bold transition-all ${selectedColor === i ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md scale-105' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 mt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[9px] font-bold uppercase text-gray-400 group-hover/card:text-gray-600 transition-colors">
                <div className="flex flex-col items-center"><ShieldCheck />Sécurisé</div>
                <div className="flex flex-col items-center"><TruckIcon />Rapide</div>
                <div className="flex flex-col items-center"><StarIcon />Qualité</div>
              </div>
            </div>
            
            {/* VERSION MOBILE */}
            <div className="lg:hidden mt-12 space-y-12 pb-20">
                <div className="w-full h-px bg-gray-100"></div>
                <section>
                   <div className="bg-blue-600 rounded-2xl p-4 mb-8 shadow-lg">
                     <h2 className="text-[16px] font-black uppercase tracking-[0.3em] text-white text-center">Description détaillée</h2>
                   </div>
                   <div className="prose prose-blue max-w-none text-gray-600 text-[15px] px-2">
                      <PortableText value={product.content || []} />
                   </div>
                </section>
                {product.faq && product.faq.length > 0 && (
                  <section className="border-t border-gray-100 pt-12">
                     <div className="bg-blue-600 rounded-2xl p-4 mb-8 shadow-lg">
                       <h2 className="text-[16px] font-black uppercase tracking-[0.3em] text-white text-center">Questions fréquentes</h2>
                     </div>
                     <div className="space-y-4 px-2">
                       {product.faq.map((item: any, i: number) => (
                         <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-[#FAFAFA]/50">
                           <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                             <span className="text-[15px] font-bold text-gray-900">{item.question}</span>
                             <div className={`transition-transform ${openFaq === i ? 'rotate-45 text-blue-600' : 'text-gray-400'}`}><PlusIcon /></div>
                           </button>
                           {openFaq === i && <p className="p-6 pt-0 text-[14px] text-gray-500 leading-relaxed">{item.answer}</p>}
                         </div>
                       ))}
                     </div>
                  </section>
                )}
            </div>
          </div>
        </div>

        {/* MAILLAGE INTERNE : PASSAGE EN UL/LI POUR LE SEO */}
        {product.category?.relatedProducts && product.category.relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-gray-100 pt-16 mb-16" aria-labelledby="related-title">
            <div className="flex flex-col items-center mb-12 text-center">
              <h2 id="related-title" className="text-[20px] font-black uppercase tracking-[0.3em] text-gray-900">Dans la même catégorie</h2>
              <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-widest font-bold italic">Nos meilleures alternatives RENW</p>
              <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 list-none p-0">
              {product.category.relatedProducts.filter((item: any) => item._id !== product._id).slice(0, 4).map((rel: any) => (
                  <li key={rel._id}>
                    <Link href={`/${rel.slug?.current}`} title={`Voir le produit ${rel.name}`} className="group bg-[#FAFAFA] rounded-[2.5rem] p-5 transition-all hover:bg-white hover:shadow-2xl border border-transparent hover:border-gray-100 flex flex-col items-center">
                      <div className="aspect-square w-full flex items-center justify-center mb-4 overflow-hidden relative">
                        {rel.mainImage && (
                          <img 
                            src={urlFor(rel.mainImage).url()} 
                            alt={`${rel.name} reconditionné certifié RENW France`} 
                            className="max-h-[120px] w-auto object-contain group-hover:scale-110 transition-transform duration-500 ease-out" 
                            loading="lazy"
                          />
                        )}
                      </div>
                      <h3 className="text-[11px] font-black text-gray-900 text-center uppercase tracking-widest leading-tight h-8 flex items-center group-hover:text-blue-600 transition-colors">{rel.name}</h3>
                      <div className="mt-3 text-blue-600 font-bold text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">Découvrir</div>
                    </Link>
                  </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}