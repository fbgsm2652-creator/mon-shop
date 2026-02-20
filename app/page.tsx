import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export default async function HomePage() {
  const data = await client.fetch(`*[_type == "homeSettings"][0]{
    ...,
    featuredProducts[]->{
      _id,
      name,
      "slug": slug.current,
      "imageUrl": images[0].asset->url,
      "price": price,
      brand
    }
  }`);

  const btnStyle = "bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:text-white transition-all duration-300";
  const btnPriceStyle = "inline-block bg-white text-black px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.2em] border border-gray-100 group-hover:bg-[#111111] group-hover:text-white transition-all duration-300";
  
  const btnSelectionStyle = "bg-white text-black px-10 md:px-[136px] py-5 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.3em] shadow-lg border border-gray-100 hover:bg-black hover:text-white transition-all duration-500 whitespace-nowrap inline-block";
  const btnProduitsStyle = "bg-white text-black px-10 md:px-[125px] py-[18px] rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.3em] shadow-lg border border-gray-100 hover:bg-black hover:text-white transition-all duration-500 whitespace-nowrap inline-block";

  return (
    <main className="bg-white text-[#111111] font-sans antialiased overflow-x-hidden">
      
      {/* NOUVEAU : H1 CACHÉ POUR LE SEO (Lu en premier par les robots) */}
      <h1 className="sr-only">RENW France : Smartphones Reconditionnés et Pièces Détachées Certifiées</h1>

      {/* 1. HERO SLIDER - SEO: LCP Optimization */}
      <section className="w-full" aria-label="Offre promotionnelle">
        <div className="relative h-[65vh] w-full overflow-hidden">
          {data?.slider?.[0] && (
            <div className="relative h-full w-full group">
              <Image 
                src={urlFor(data.slider[0].image).url()} 
                alt={data.slider[0].alt || "Expertise Renw Tech"} 
                fill 
                className="object-cover" 
                priority // Critique pour le score LCP de Google
                sizes="100vw"
              />
              {data.slider[0].showBadge && (
                <div className="absolute top-10 left-10 md:left-20">
                  <span className="bg-white/20 backdrop-blur-md text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {data.btnTransition1 || "Nos Sélections"}
                  </span>
                </div>
              )}
              <div className="absolute bottom-12 left-10 md:left-20">
                <Link href={data.slider[0].link || "/"} className={btnStyle}>
                  Découvrir l'expertise
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. BOUTON TRANSITION 1 */}
      <div className="flex justify-center mt-12 relative z-10 px-4">
        <div className={btnSelectionStyle}>
          {data?.btnTransition1 || "NOS SÉLECTIONS"}
        </div>
      </div>

      {/* 3. BENTO GRID - SEO: Sémantique */}
      <section className="max-w-7xl mx-auto px-6 mt-16" aria-label="Nos catégories de produits">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {data?.bentoGrid?.map((item: any, i: number) => (
            <Link key={i} href={item.link || "#"} className={`relative overflow-hidden rounded-[2.5rem] bg-[#F5F5F7] aspect-square group ${i === 0 || i === 3 ? 'md:col-span-2 md:aspect-[21/9]' : ''}`}>
              {item.image && <Image src={urlFor(item.image).url()} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />}
              <div className="absolute bottom-8 left-8">
                {/* CHANGEMENT SÉMANTIQUE : h3 -> span pour ne pas casser la hiérarchie H1 > H2 */}
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#111111]">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. RÉASSURANCE - Signal de confiance (E-E-A-T) */}
      <section className="bg-[#F5F5F7] py-16 mt-20" aria-label="Engagements de qualité">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-10">
          {data?.reassurance?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-5 flex-1 min-w-[250px] justify-center">
              {item.icon && (
                <div className="relative w-[50px] h-[50px]">
                  <Image src={urlFor(item.icon).url()} alt="" fill className="object-contain opacity-80" />
                </div>
              )}
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BLOC TEXTE SEO - Transformation en H2 sémantique (Le H1 est maintenant tout en haut) */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[22px] md:text-[32px] font-[1000] tracking-tighter uppercase mb-8 leading-tight">
          {data?.seoBlock?.title || "Expertise Tech & Reconditionné Certifié"}
        </h2>
        <div className="text-gray-500 leading-loose text-[15px] font-medium whitespace-pre-line px-4 md:px-10">
          {data?.seoBlock?.content}
        </div>
      </section>

      {/* 6. BOUTON TRANSITION 2 */}
      <div className="flex justify-center mb-24 px-4">
        <div className={btnProduitsStyle}>
          {data?.btnTransition2 || "NOS PRODUITS PHARES"}
        </div>
      </div>

      {/* 7. PRODUITS PHARES */}
      <section className="max-w-7xl mx-auto px-6 pb-32" aria-labelledby="featured-products-title">
        <h2 id="featured-products-title" className="sr-only">Nos produits en vedette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {data?.featuredProducts?.map((product: any) => (
            <article key={product._id}>
              {/* CORRECTION CRITIQUE URL COURTE : "/produit/${product.slug}" devient "/${product.slug}" */}
              <Link href={`/${product.slug}`} className="group block text-center">
                <div className="aspect-[4/5] bg-[#F5F5F7] rounded-[2.5rem] overflow-hidden mb-6 flex items-center justify-center p-10 transition-all group-hover:bg-white group-hover:shadow-2xl border border-transparent">
                  {product.imageUrl && (
                    <Image 
                      src={product.imageUrl} 
                      alt={`Photo de ${product.name}`} 
                      width={280} 
                      height={280} 
                      className="object-contain transition-transform duration-500 group-hover:scale-110" 
                    />
                  )}
                </div>
                <div className="px-2 space-y-2">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">{product.brand}</p>
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#111111] line-clamp-1">{product.name}</h3>
                  <div className="pt-2">
                    <span className={btnPriceStyle}>
                      {product.price ? `${product.price} €` : "Voir le prix"}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* SEO MASTER JSON-LD ENRICHI (WebSite + Organization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
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
              "logo": "https://renw.fr/logo.png", // Mets l'URL exacte de ton logo ici si tu l'as
              "description": "Expert français en smartphones reconditionnés et pièces détachées de haute qualité.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "FR"
              }
            }
          ])
        }}
      />
    </main>
  );
}