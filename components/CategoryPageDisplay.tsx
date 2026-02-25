"use client";

import { useState, useMemo, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { urlFor } from "@/sanity/lib/image";
import { 
  ShoppingBag, 
  X, 
  ArrowRight, 
  Check, 
  ChevronDown,
  ShieldCheck,
  Truck,
  Filter,
  ArrowUpDown,
  Zap,
  ChevronRight,
  Info
} from "lucide-react";

/**
 * @meta_keywords smartphone reconditionné, high-tech premium, garantie 12 mois, expert réparation français, SAV réactif, économie circulaire, RENW
 */

// --- CONFIGURATION STYLE LUXE ---
const brandBlue = "#0066CC"; 
const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

// --- UTILS : LOGIQUE DE PRIX & FILTRES ---
const getMinPrice = (product: any) => {
  if (!product.isReconditioned) {
    if (product.price) return product.price;
    if (product.simpleVariants?.length > 0) return Math.min(...product.simpleVariants.map((v: any) => v.price || Infinity));
    return product.minPrice || 0;
  }
  if (product.grades?.length > 0) {
    const allPrices = product.grades.flatMap((g: any) => g.capacities?.map((c: any) => c.price) || []).filter(Boolean);
    return allPrices.length > 0 ? Math.min(...allPrices) : (product.minPrice || 0);
  }
  return product.minPrice || 0;
};

const getAvailableGrades = (product: any) => {
  if (!product.isReconditioned || !product.grades) return [];
  return product.grades.map((g: any) => g.gradeName);
};

const guessBrand = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('iphone') || n.includes('ipad') || n.includes('apple')) return 'Apple';
  if (n.includes('galaxy') || n.includes('samsung')) return 'Samsung';
  if (n.includes('pixel') || n.includes('google')) return 'Google';
  if (n.includes('redmi') || n.includes('xiaomi')) return 'Xiaomi';
  if (n.includes('sony')) return 'Sony';
  return 'Premium';
};

export default function CategoryPageDisplay({ category }: { category: any }) {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États des Modales
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [addedToCartProduct, setAddedToCartProduct] = useState<any>(null);
  
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const categoryFaqs = category.faq || category.faqs || [];
  const baseUrl = "https://renw.fr";

  // Filtres
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'relevance');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.get('brands')?.split(',').filter(Boolean) || []);
  const [maxPrice, setMaxPrice] = useState<number | ''>(searchParams.get('max') ? Number(searchParams.get('max')) : '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (sortOrder !== 'relevance') params.set('sort', sortOrder);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (maxPrice !== '') params.set('max', maxPrice.toString());
    const query = params.toString();
    router.push(`/${category.slug?.current || category.slug}${query ? `?${query}` : ''}`, { scroll: false });
  }, [sortOrder, selectedBrands, maxPrice, category.slug, router]);

  const filteredProducts = useMemo(() => {
    let result = (category.categoryProducts || []).map((p: any) => ({
      ...p,
      parsedMinPrice: getMinPrice(p),
      parsedBrand: guessBrand(p.name)
    }));

    if (selectedBrands.length > 0) result = result.filter((p: any) => selectedBrands.includes(p.parsedBrand));
    if (maxPrice !== '') result = result.filter((p: any) => p.parsedMinPrice <= Number(maxPrice));

    if (sortOrder === 'asc') result.sort((a: any, b: any) => a.parsedMinPrice - b.parsedMinPrice);
    else if (sortOrder === 'desc') result.sort((a: any, b: any) => b.parsedMinPrice - a.parsedMinPrice);

    return result;
  }, [category.categoryProducts, selectedBrands, maxPrice, sortOrder]);

  const allPossibleBrands = useMemo(() => {
    const brands = (category.categoryProducts || []).map((p: any) => guessBrand(p.name));
    return Array.from(new Set(brands)) as string[];
  }, [category.categoryProducts]);

  const toggleFilter = (list: string[], setList: any, value: string) => {
    setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value]);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); e.stopPropagation();
    if (product.isReconditioned) {
      setQuickViewProduct(product);
    } else {
      cart.addItem({ _id: product._id, name: product.name, price: product.parsedMinPrice, images: [product.mainImage], quantity: 1 });
      setAddedToCartProduct(product); 
    }
  };

  return (
    <main style={eliteFont} className="bg-white min-h-screen text-[#111111] antialiased">
      
      {/* 🚀 SEO 200/100 JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        "name": `${category.h1Title || category.name || category.title} - RENW`,
        "description": category.metaDescription || category.description || "Découvrez notre gamme premium.",
        "url": `${baseUrl}/${category.slug?.current || category.slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": filteredProducts.slice(0, 10).map((p: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${baseUrl}/${p.slug?.current || p.slug}`
          }))
        }
      })}} />

      {/* --- HEADER --- */}
      <header className="bg-[#F8FAFC] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <nav className="flex items-center gap-2 mb-4 md:mb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" style={{ color: brandBlue }} className="hover:opacity-80 transition-colors">Accueil</Link>
            <ChevronRight size={10} className="opacity-30" />
            <span className="text-[#111111] truncate">{category.name || category.title}</span>
          </nav>
          
          <span style={{ color: brandBlue }} className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-2 md:mb-4 block">
            Expertise RENW France
          </span>
          
          {/* 🔥 MODIFICATION H1 : Prise en compte du nouveau champ SEO 🔥 */}
          <h1 className="text-[22px] sm:text-[28px] md:text-[38px] font-[1000] tracking-tighter leading-none text-[#111111] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            {category.h1Title || category.name || category.title}<span style={{ color: brandBlue }}>.</span>
          </h1>

          {/* DESCRIPTION SOUS LE H1 (Connectée à Sanity) */}
          {(category.heroSubtitle || category.metaDescription || category.description) && (
            <p className="mt-4 md:mt-6 text-gray-500 font-medium text-[15px] md:text-xl max-w-3xl leading-relaxed">
              {category.heroSubtitle || category.metaDescription || category.description}
            </p>
          )}
          
          <div className="mt-6 md:mt-8 flex items-center gap-4">
             <div style={{ backgroundColor: brandBlue }} className="text-white text-[9px] md:text-[10px] font-black px-4 md:px-5 py-2 md:py-2.5 rounded-full uppercase tracking-widest shadow-md">
                {filteredProducts.length} Modèles disponibles
             </div>
          </div>
        </div>
      </header>

      {/* --- TOOLBAR FILTRES (Caché sur mobile) --- */}
      <div className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterMenuOpen(true)}
              className="flex items-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-80 transition-all"
            >
              <Filter size={14} /> Filtres
            </button>
            <div className="hidden md:flex gap-2 ml-4">
               {selectedBrands.map(b => (
                 <span key={b} className="bg-gray-100 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                   {b} <X size={10} className="cursor-pointer" onClick={() => toggleFilter(selectedBrands, setSelectedBrands, b)}/>
                 </span>
               ))}
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-xl transition-all"
            >
              <ArrowUpDown size={14} /> Trier
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-50">
                {['relevance', 'asc', 'desc'].map((opt) => (
                  <button key={opt} onClick={() => {setSortOrder(opt); setIsSortOpen(false);}} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${sortOrder === opt ? 'bg-[#F0F7FF]' : 'hover:bg-gray-50'}`} style={{ color: sortOrder === opt ? brandBlue : '#111111' }}>
                    {opt === 'relevance' ? 'Pertinence' : opt === 'asc' ? 'Prix croissant' : 'Prix décroissant'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* --- 4. GRILLE PRODUITS --- */}
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 list-none p-0">
          {filteredProducts.map((p: any, index: number) => {
            const offPrice = Math.round(p.parsedMinPrice * 1.35);
            return (
              <li key={p._id} className="group flex flex-col">
                <Link 
                  href={`/${p.slug?.current || p.slug}`} 
                  className="flex flex-col h-full bg-white rounded-[1.5rem] p-4 md:p-6 transition-all duration-500 shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-transparent relative"
                >
                  <div className="relative aspect-square flex items-center justify-center mb-4 md:mb-6">
                    {p.mainImage && (
                      <Image 
                        src={typeof p.mainImage === 'string' ? p.mainImage : p.mainImage?.asset?.url} 
                        alt={p.name} 
                        fill
                        priority={index < 4}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" 
                      />
                    )}
                  </div>

                  <div className="mb-4 flex-1">
                    <h2 className="font-medium text-[14px] md:text-[15px] leading-tight text-[#111111] line-clamp-2">{p.name}</h2>
                  </div>

                  {/* Ligne de séparation renforcée */}
                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium line-through leading-none mb-1">{offPrice}€</span>
                      <span style={{ color: brandBlue }} className="text-[18px] md:text-[21px] font-medium leading-none">{p.parsedMinPrice}€</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={(e) => handleQuickAdd(e, p)} 
                      className="w-9 h-9 md:w-11 md:h-11 bg-[#111111] text-white rounded-[0.8rem] hover:opacity-80 transition-all flex items-center justify-center shadow-md active:scale-95"
                      aria-label={`Ajouter ${p.name} au panier`}
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* --- ENGAGEMENT & DESCRIPTION VIGNETTE --- */}
        <section className="mt-20 md:mt-32 border-t border-gray-100 pt-16 md:pt-20">
          <div className="grid lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-[28px] md:text-[32px] font-[1000] uppercase tracking-tighter leading-none mb-6">
                {category.engagementTitle || "L'Engagement"} <br/><span style={{ color: brandBlue }}>RENW.</span>
              </h2>
              
              <div className="space-y-3 md:space-y-4">
                {category.features?.length > 0 ? (
                  category.features.map((feature: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-[1.2rem] shadow-sm">
                      {feature.icon && (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Image src={urlFor(feature.icon).url()} width={24} height={24} alt="" />
                        </div>
                      )}
                      <p className="text-[11px] font-black uppercase tracking-widest">{feature.title}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-[1.2rem]">
                      <Zap size={20} style={{ color: brandBlue }} />
                      <p className="text-[11px] font-black uppercase tracking-widest">Contrôle technique strict</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-[1.2rem]">
                      <ShieldCheck size={20} style={{ color: brandBlue }} />
                      <p className="text-[11px] font-black uppercase tracking-widest">SAV Réactif 6j/7</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[1.2rem] shadow-[0_10px_30px_rgba(0,0,0,0.06)] h-full">
                <div className="prose max-w-none text-gray-500 font-medium leading-relaxed">
                  {category.content ? (
                    <PortableText value={category.content} />
                  ) : (
                    <p>Découvrez notre sélection de {category.name} certifiés et garantis par nos experts français.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="mt-20 md:mt-32">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-[28px] md:text-[40px] font-[1000] tracking-tighter uppercase text-[#111111]">
              {category.faqMainTitle || category.faqTitle || `Tout savoir sur les ${category.name}`}
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {categoryFaqs.map((faq: any, index: number) => (
              <details key={index} className="group bg-white rounded-[1.2rem] border border-gray-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300 shadow-sm open:shadow-md" style={{ borderColor: 'transparent' }} onToggle={(e) => { e.currentTarget.style.borderColor = e.currentTarget.open ? brandBlue : '#f3f4f6' }}>
                <summary className="flex items-center justify-between cursor-pointer p-6 md:p-8 font-bold text-[15px] md:text-[18px] text-[#111111] hover:text-gray-600 outline-none">
                  {faq.question}
                  <ChevronDown className="group-open:rotate-180 transition-transform shrink-0 ml-4" style={{ color: brandBlue }} />
                </summary>
                
                <div className="px-6 md:px-8 pb-8 pt-2">
                  <div className="border-l-2 pl-5 text-gray-500 font-medium text-[14px] md:text-lg leading-relaxed" style={{ borderColor: brandBlue }}>
                    {faq.answer}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Bouton du Bas (Connecté à Sanity) */}
          <div className="mt-12 md:mt-16 text-center">
            <Link href={category.ctaLink || "/"} style={{ backgroundColor: brandBlue }} className="inline-block px-10 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all">
               {category.ctaText || "En savoir plus sur nos méthodes"}
            </Link>
          </div>
        </section>
      </div>

      {/* --- MODAL FILTRES --- */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          <div className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm" onClick={() => setIsFilterMenuOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[1.5rem]">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-2xl font-[1000] uppercase tracking-tighter">Affiner</h2>
                <button onClick={() => setIsFilterMenuOpen(false)} aria-label="Fermer les filtres" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div>
                   <h3 className="font-black uppercase text-[11px] tracking-widest text-gray-400 mb-6">Par Marque</h3>
                   <div className="flex flex-wrap gap-2">
                      {allPossibleBrands.map(brand => (
                        <button key={brand} onClick={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} className={`px-4 py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${selectedBrands.includes(brand) ? 'border-[#0066CC] bg-[#F0F7FF] text-[#0066CC]' : 'border-gray-100 text-gray-400'}`}>
                          {brand}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <h3 className="font-black uppercase text-[11px] tracking-widest text-gray-400 mb-6">Budget Maximum</h3>
                   <input aria-label="Ajuster le budget maximum" type="range" min="0" max="1500" step="50" value={maxPrice || 1500} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandBlue }} />
                   <div style={{ color: brandBlue }} className="mt-4 text-3xl font-[1000]">{maxPrice || 1500}€</div>
                </div>
             </div>
             <div className="p-8 border-t border-gray-100">
                <button onClick={() => setIsFilterMenuOpen(false)} style={{ backgroundColor: brandBlue }} className="w-full text-white py-6 rounded-xl font-black uppercase tracking-widest text-[11px] hover:opacity-90 transition-opacity shadow-xl">
                  Voir les produits
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- QUICK VIEW (MODAL PRODUIT RECONDITIONNÉ) --- */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[1.5rem] p-8 md:p-10 relative shadow-2xl animate-in zoom-in duration-300">
            <button aria-label="Fermer la vue rapide" onClick={() => setQuickViewProduct(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#111111] bg-gray-50 rounded-full transition-colors"><X size={20} /></button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-video relative mb-8 bg-[#F0F7FF] rounded-[1.2rem] flex items-center justify-center p-8 border border-[#E0F0FF]">
                <Image src={typeof quickViewProduct.mainImage === 'string' ? quickViewProduct.mainImage : quickViewProduct.mainImage?.asset?.url} fill sizes="(max-width: 768px) 80vw, 400px" className="object-contain p-6 mix-blend-multiply" alt={quickViewProduct.name} />
              </div>
              
              <h2 className="text-[24px] font-[1000] mb-2 leading-tight text-[#111111]">{quickViewProduct.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-[#111111] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">Option à configurer</span>
                <span style={{ color: brandBlue }} className="font-medium text-[20px]">{quickViewProduct.parsedMinPrice}€</span>
              </div>
              
              <p className="text-gray-500 font-medium text-[15px] leading-relaxed px-2 mb-8">
                <Info size={16} style={{ color: brandBlue }} className="inline-block mr-2 -mt-0.5" />
                Information produit : Ce modèle nécessite de configurer votre grade esthétique et l'état de la batterie.
              </p>

              <div className="w-full flex flex-col gap-3">
                <Link href={`/${quickViewProduct.slug?.current || quickViewProduct.slug}`} style={{ backgroundColor: brandBlue }} className="w-full text-white py-5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Configurer & Passer à la caisse <ArrowRight size={14} />
                </Link>
                <button onClick={() => setQuickViewProduct(null)} className="w-full bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:border-gray-300 hover:text-[#111111] transition-all">
                  Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SUCCÈS PANIER (PRODUIT STANDARD / ACCESSOIRES) --- */}
      {addedToCartProduct && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[1.5rem] p-8 md:p-10 relative shadow-2xl animate-in zoom-in duration-300">
            <button aria-label="Fermer la notification" onClick={() => setAddedToCartProduct(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#111111] bg-gray-50 rounded-full transition-colors"><X size={20} /></button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-video relative mb-8 bg-[#F0F7FF] rounded-[1.2rem] flex items-center justify-center p-8 border border-[#E0F0FF]">
                <Image src={typeof addedToCartProduct.mainImage === 'string' ? addedToCartProduct.mainImage : addedToCartProduct.mainImage?.asset?.url} fill sizes="(max-width: 768px) 80vw, 400px" className="object-contain p-6 mix-blend-multiply" alt={addedToCartProduct.name} />
              </div>
              
              <h2 className="text-[24px] font-[1000] mb-2 leading-tight text-[#111111]">{addedToCartProduct.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 bg-green-50 px-3 py-1 rounded-md">
                  <Check size={14} strokeWidth={3} /> Ajouté au panier
                </span>
                <span style={{ color: brandBlue }} className="font-medium text-[20px]">{addedToCartProduct.parsedMinPrice}€</span>
              </div>
              
              <p className="text-gray-500 font-medium text-[15px] leading-relaxed px-2 mb-8">
                <Info size={16} style={{ color: brandBlue }} className="inline-block mr-2 -mt-0.5" />
                Information : Votre article a bien été ajouté. Vous pouvez finaliser votre commande ou continuer vos achats.
              </p>

              <div className="w-full flex flex-col gap-3">
                <Link href="/panier" style={{ backgroundColor: brandBlue }} className="w-full text-white py-5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Passer à la caisse <ArrowRight size={14} />
                </Link>
                <button onClick={() => setAddedToCartProduct(null)} className="w-full bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:border-gray-300 hover:text-[#111111] transition-all">
                  Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}