import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import AutoSlider from "@/components/AutoSlider"; 

// Revalidation toutes les 60 secondes
export const revalidate = 60;

export const metadata = {
  title: "RENW | L'Expert du Smartphone Reconditionné et Pièces Détachées",
  description: "Découvrez notre sélection de smartphones reconditionnés Premium garantis 12 mois, testés sur 40 points de contrôle. Pièces détachées d'origine et compatibles.",
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default async function HomePage() {
  const data = await client.fetch(`*[_type == "homeSettings"][0]{
    ...,
    featuredProducts[]->{
      _id,
      name,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      "price": coalesce(price, grades[0].capacities[0].price, simpleVariants[0].price),
      "originalPrice": priceWhenNew
    },
    bestSellers[]->{
      _id,
      name,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      "price": coalesce(price, grades[0].capacities[0].price, simpleVariants[0].price),
      "originalPrice": priceWhenNew
    }
  }`);

  const faqs = [
    {
      question: "Pouvez-vous m'aider à recycler mon ancien téléphone ?",
      answer: "Notre Service Recyclage est là pour vous mettre en relation avec les bonnes personnes et vous simplifier cette démarche. Si votre article a encore de la valeur, obtenez une estimation immédiate via notre Service Reprise. L'expédition est offerte."
    },
    {
      question: "D'où proviennent les appareils reconditionnés RENW ?",
      answer: "Tous nos appareils proviennent de circuits de reprise européens certifiés. Ils sont ensuite testés sur plus de 40 points de contrôle, réparés si nécessaire avec des pièces d'origine ou compatibles de haute qualité, et nettoyés par nos experts en France."
    },
    {
      question: "Quelle est la garantie sur vos produits ?",
      answer: "Nous offrons une garantie commerciale de 12 à 24 mois sur tous nos appareils reconditionnés. En cas de problème, notre SAV français s'engage à vous répondre sous 24h et à procéder à un échange ou une réparation rapide."
    },
    {
      question: "Est-ce que je peux payer en plusieurs fois ?",
      answer: "Oui, absolument. Nous proposons des facilités de paiement sécurisées en 3x ou 4x sans frais par carte bancaire pour vous permettre de vous équiper sereinement."
    }
  ];

  const seoSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "RENW France",
      "alternateName": "RENW Technology",
      "url": "https://renw.fr",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://renw.fr/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RENW",
      "url": "https://renw.fr",
      "logo": "https://renw.fr/logo.png",
      "description": "Expert français en smartphones reconditionnés et pièces détachées de haute qualité.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "FR"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  const btnPriceStyle = "inline-block bg-[#111111] text-white px-6 py-3 rounded-xl font-normal text-[11px] md:text-[12px] uppercase tracking-widest shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:opacity-90 transition-all duration-300 w-full text-center";
  const btnSectionStyle = "bg-[#111111] text-white px-6 md:px-12 py-4 md:py-5 rounded-2xl font-normal text-[12px] md:text-[14px] uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-[#111111] transition-all duration-500 whitespace-nowrap inline-block";

  return (
    <main className="bg-white text-[#111111] font-light antialiased overflow-x-hidden">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }}
      />

      <h1 className="sr-only">RENW France : Smartphones Reconditionnés et Pièces Détachées Certifiées</h1>

      {/* 1. NOTRE NOUVEAU HERO SLIDER AUTO */}
      <section className="w-full px-4 md:px-6 mt-4 md:mt-8" aria-label="Offre promotionnelle">
        <AutoSlider slides={data?.slider || []} btnText={data?.btnTransition1 || "L'Art du Reconditionné"} />
      </section>

      {/* 2. TICKER ANNONCE */}
      <div className="flex justify-center mt-10 mb-16 relative z-10 px-4">
        <div className={btnSectionStyle}>
          {data?.btnTransition1 || "Livraison gratuite sur tous les smartphones"}
        </div>
      </div>

      {/* 3. BENTO GRID */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 mb-24" aria-label="Nos catégories de produits">
        <div className="flex items-end justify-between mb-8 px-2">
           <h2 className="text-[24px] md:text-[32px] font-normal tracking-tighter text-[#111111]">Explorez l'univers RENW.</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {data?.bentoGrid?.map((item: any, i: number) => {
            const isBig = i === 0 || i === 3;
            return (
              <Link key={i} href={item.link || "#"} className={`relative overflow-hidden rounded-[1.5rem] bg-white group transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 border border-gray-100 flex items-center justify-center p-6 h-[200px] md:h-[320px] ${isBig ? 'md:col-span-2 col-span-2' : 'col-span-1'}`}>
                {item.image && (
                  <div className="relative w-[70%] h-[70%] z-10">
                    <Image src={urlFor(item.image).url()} alt="" aria-hidden="true" fill className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100 z-20 transition-transform group-hover:-translate-y-1">
                  <span className="block text-[11px] font-normal tracking-widest text-[#111111] uppercase">{item.title}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. LES CLIENTS AIMENT CECI */}
      {data?.bestSellers && data.bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24" aria-labelledby="best-sellers-title">
          <div className="flex items-end justify-between mb-8 px-2">
             <h2 id="best-sellers-title" className="text-[20px] md:text-[28px] font-normal tracking-tighter text-[#111111]">
               Les clients aiment ceci
             </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.bestSellers.map((product: any) => {
              const savings = product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0;
              
              return (
                <article key={product._id} className="h-full">
                  <Link href={`/${product.slug}`} className="group block text-center bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 h-full flex flex-col relative">
                    <div className="aspect-square bg-[#F5F5F7] rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4 relative">
                      {product.imageUrl && (
                        <div className="relative w-[70%] h-[70%]">
                          <Image 
                            src={product.imageUrl} 
                            alt="" 
                            aria-hidden="true"
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-1 space-y-2 flex flex-col flex-grow">
                      <h3 className="text-[14px] md:text-[15px] font-normal text-[#111111] line-clamp-2 leading-tight text-left mt-1">{product.name}</h3>
                      <div className="pt-3 mt-auto w-full flex flex-col">
                        {savings > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] text-[#111111] line-through">Neuf {product.originalPrice}€</span>
                            <span className="text-[#0A5C2F] text-[10px] font-normal px-1.5 py-0.5 rounded bg-[#D9EFD5]/50 border border-[#0A5C2F]/20">-{savings.toFixed(0)}€</span>
                          </div>
                        )}
                        <span className={btnPriceStyle}>
                          {product.price ? `${product.price} €` : "Voir le prix"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* 5. RÉASSURANCE */}
      <section className="bg-[#F4F9FF] py-16 md:py-24 mt-8" aria-label="Engagements de qualité">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-center text-[22px] md:text-[28px] font-normal tracking-tighter mb-12 text-[#111111]">Des engagements solides.</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-center">
             {data?.reassurance?.map((item: any, i: number) => (
               <div key={i} className="flex flex-col items-center bg-white p-6 md:p-8 rounded-[1.5rem] border border-[#E5F0FF] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                 {item.icon && (
                   <div className="w-12 h-12 flex items-center justify-center mb-4">
                     <div className="relative w-[32px] h-[32px]">
                       <Image src={urlFor(item.icon).url()} alt="" aria-hidden="true" fill className="object-contain" />
                     </div>
                   </div>
                 )}
                 <h3 className="text-[13px] md:text-[14px] font-normal leading-snug text-[#111111]">{item.text}</h3>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 6. BLOC TEXTE SEO (Noir Pur) */}
      <section className="bg-white max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[22px] md:text-[32px] font-normal tracking-tighter mb-6 leading-tight text-[#111111]">
          {data?.seoBlock?.title || "Expertise Tech & Reconditionné Certifié"}
        </h2>
        <div className="text-[#111111] font-normal leading-relaxed text-[15px] md:text-[16px] whitespace-pre-line">
          {data?.seoBlock?.content}
        </div>
      </section>

      {/* 7. BOUTON TRANSITION 2 */}
      <div className="flex justify-center mb-20 px-4">
        <div className={btnSectionStyle}>
          {data?.btnTransition2 || "NOS PRODUITS PHARES"}
        </div>
      </div>

      {/* 8. PRODUITS PHARES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24" aria-labelledby="featured-products-title">
        <h2 id="featured-products-title" className="sr-only">Nos produits en vedette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data?.featuredProducts?.map((product: any) => {
            const savings = product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0;
            
            return (
              <article key={product._id} className="h-full">
                <Link href={`/${product.slug}`} className="group block text-center bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 h-full flex flex-col">
                  <div className="aspect-square bg-[#F5F5F7] rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4 relative">
                    {product.imageUrl && (
                      <div className="relative w-[70%] h-[70%]">
                        <Image 
                          src={product.imageUrl} 
                          alt="" 
                          aria-hidden="true"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    )}
                  </div>
                  <div className="px-1 space-y-2 flex flex-col flex-grow">
                    <h3 className="text-[14px] md:text-[15px] font-normal text-[#111111] line-clamp-2 leading-tight text-left mt-1">{product.name}</h3>
                    <div className="pt-3 mt-auto w-full flex flex-col">
                      {savings > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-[#111111] line-through">Neuf {product.originalPrice}€</span>
                          <span className="text-[#0A5C2F] text-[10px] font-normal px-1.5 py-0.5 rounded bg-[#D9EFD5]/50 border border-[#0A5C2F]/20">-{savings.toFixed(0)}€</span>
                        </div>
                      )}
                      <span className={btnPriceStyle}>
                        {product.price ? `${product.price} €` : "Voir le prix"}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* 9. SECTION FAQ */}
      <section className="bg-white py-20 border-t border-gray-100" aria-labelledby="faq-title">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-left md:text-center">
             <h2 id="faq-title" className="text-[24px] md:text-[32px] font-normal tracking-tighter text-[#111111]">
               Questions fréquentes
             </h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 font-normal text-[14px] md:text-[15px] text-[#111111] outline-none">
                  {faq.question}
                  <span className="transition duration-300 group-open:rotate-45 ml-4 shrink-0 bg-[#F5F5F7] p-2 rounded-full text-[#111111]">
                    <PlusIcon className="w-4 h-4 stroke-1" />
                  </span>
                </summary>
                <div className="px-5 md:px-6 pb-6 pt-0">
                  <p className="text-[#111111] font-normal leading-relaxed text-[13px] md:text-[14px]">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}