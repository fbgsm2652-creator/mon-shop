"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import FAQ from "@/components/product-faq"; 

export default function CategoryPageDisplay({ category }: { category: any }) {
  const cart = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const categoryFaqs = category.faq || category.faqs || [];
  const baseUrl = "https://renw.fr";

  // Police imposée pour l'identité visuelle
  const geminiFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.isReconditioned) {
      setQuickViewProduct(product);
    } else {
      cart.addItem({
        _id: product._id,
        name: product.name,
        price: product.minPrice,
        images: [product.mainImage],
        quantity: 1
      });
      toast.success(`${product.name} ajouté !`);
    }
  };

  return (
    <main style={geminiFont} className="bg-white min-h-screen text-[#111111] antialiased">
      
      {/* --- HEADER : BANDE BLEU CLAIR --- */}
      <header className="bg-blue-50/50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <span className="text-[8px] opacity-30">/</span>
            <span className="text-blue-600">{category.name || category.title}</span>
          </nav>

          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">
            Expertise RENW France
          </span>
          <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight leading-none text-[#111111]">
            {category.name || category.title}<span className="text-blue-600">.</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* --- GRILLE PRODUITS (Structure Sémantique UL/LI) --- */}
        <ul className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 list-none p-0">
          {category.categoryProducts?.map((p: any, index: number) => (
            <li key={p._id} className="group relative">
              <Link 
                href={`/${p.slug}`} 
                className="flex flex-col h-full bg-[#FAFAFA] rounded-[2.5rem] p-6 md:p-8 transition-all duration-700 hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100"
              >
                
                <div className="flex-grow flex items-center justify-center min-h-[220px] md:min-h-[250px] py-4">
                  {p.mainImage && (
                    <Image 
                      src={p.mainImage} 
                      alt={`${p.name} reconditionné certifié - Expertise RENW`} 
                      width={220}
                      height={220}
                      priority={index < 4} 
                      className="object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" 
                    />
                  )}
                </div>

                <div className="mb-6 text-center">
                  <h2 className="font-medium text-[15px] leading-tight text-[#111111] tracking-tight">
                    {p.name}
                  </h2>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <div className="flex-1 h-[52px] bg-white border-2 border-gray-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-[13px] font-bold">{p.minPrice}€</span>
                  </div>

                  <button 
                    type="button" 
                    onClick={(e) => handleQuickAdd(e, p)} 
                    aria-label={`Ajouter ${p.name} au panier`}
                    className="flex-[2.5] h-[52px] bg-[#111111] text-white rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                  >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ajouter</span>
                  </button>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* --- SECTION DESCRIPTION TECHNIQUE --- */}
        <section className="mt-32">
          <div className="bg-blue-50/50 border-y border-blue-100 py-4 px-6 mb-10 rounded-xl">
            <h2 className="text-[27px] font-bold text-gray-400 uppercase tracking-tight leading-none">Description</h2>
          </div>
          <div className="max-w-3xl px-6 text-gray-500 text-[15px] leading-loose font-medium prose prose-blue">
            {category.content || category.description ? (
              <PortableText value={category.content || category.description} />
            ) : (
              <p>Expertise technique RENW sur la gamme {category.name || category.title}.</p>
            )}
          </div>
        </section>

        {/* --- SECTION FAQ (Appel du composant centralisé) --- */}
        <FAQ items={categoryFaqs} title="Questions les plus fréquentes" />

      </div>

      {/* --- QUICK VIEW MODAL (DESIGN ORIGINAL COMPLET) --- */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-square relative mb-6">
                <Image 
                  src={quickViewProduct.mainImage} 
                  fill
                  className="object-contain" 
                  alt={quickViewProduct.name} 
                />
              </div>
              <h2 className="text-[20px] font-bold mb-2">{quickViewProduct.name}</h2>
              <p className="text-blue-600 font-bold text-[9px] uppercase tracking-widest mb-8">Option reconditionnée</p>
              
              <Link 
                href={`/${quickViewProduct.slug}`} 
                className="w-full bg-[#111111] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Personnaliser <ArrowRight size={14} />
              </Link>
              
              <p className="mt-6 text-[11px] text-gray-400 font-medium leading-relaxed px-4">
                Configurez votre grade esthétique et l'état de la batterie à l'étape suivante.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- STRUCTURED DATA (Breadcrumb) --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": baseUrl 
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": category.name || category.title,
                "item": `${baseUrl}/${category.slug}`
              }
            ]
          })
        }}
      />
    </main>
  );
}