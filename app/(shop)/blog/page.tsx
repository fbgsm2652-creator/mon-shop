// app/(shop)/blog/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image"; 
import { Metadata } from "next";

// --- METADATA POUR LE RÉFÉRENCEMENT DU MAG ---
export const metadata: Metadata = {
  title: "Le Mag RENW | Conseils, Tutoriels et Expertise iPhone & Tech",
  description: "Découvrez les guides de nos experts : tutoriels de réparation, analyses tech et conseils pour faire durer vos appareils. L'expertise RENW à votre service.",
  openGraph: {
    title: "Le Mag RENW | Expertise Tech et Réparation",
    description: "Tutoriels et analyses pour mieux comprendre et réparer vos appareils.",
    type: "website",
  },
};

export default async function BlogHomePage() {
  const data = await client.fetch(`{
    "config": *[_type == "blogHome"][0],
    "categories": *[_type == "blogCategory"] | order(title asc),
    "posts": *[_type == "post"] | order(publishedAt desc){
      title, 
      "slug": slug.current, 
      mainImage, 
      excerpt, 
      "cat": blogCategory->title
    }
  }`);

  // 🔥 DESIGN : Réintégration de la police officielle RENW 🔥
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <main style={siteFont} className="bg-white min-h-screen pt-12 pb-24 text-[#111111] antialiased">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-start">
          
          {/* GAUCHE : NAVIGATION DU MAG (Sidebar) */}
          <aside className="w-full lg:w-[320px] lg:sticky lg:top-32 shrink-0">
            <div className="space-y-10">
              <header>
                {/* 🔥 DESIGN : Titre adouci et aligné avec le reste du site 🔥 */}
                <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-none uppercase mb-3 text-[#111111]">
                  Le Mag<span className="text-[#0066CC]">.</span>
                </h1>
                <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                  {data.config?.heroSubtitle || "L'expertise RENW : Tutoriels, analyses et tests pour faire durer vos appareils."}
                </p>
              </header>

              <nav className="flex flex-col space-y-3" aria-label="Catégories du blog">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">Thématiques</p>
                <Link href="/blog" className="text-[14px] font-semibold text-[#0066CC] hover:opacity-80 transition-opacity">
                  Toutes les actus
                </Link>
                
                {data.categories?.map((cat: any) => (
                  <Link 
                    key={cat._id} 
                    href={`/blog/${cat.slug.current}`} 
                    className="text-[14px] font-medium text-gray-600 hover:text-[#0066CC] transition-colors flex items-center justify-between group"
                  >
                    {cat.title}
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                  </Link>
                ))}
              </nav>

              <div className="p-8 bg-[#F5F5F7] rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-[13px] font-semibold mb-3 text-[#111111]">Une question technique ?</p>
                <Link href="/contact" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#0066CC] hover:opacity-80 transition-opacity group">
                  Contactez nos experts <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* DROITE : FLUX D'ARTICLES (Grid) */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {data.posts?.map((post: any, index: number) => (
                <article key={post.slug} className="group flex flex-col h-full">
                  <Link href={`/blog/post/${post.slug}`} className="flex flex-col h-full bg-white rounded-[2rem] p-4 md:p-5 transition-all duration-500 shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50 hover:border-transparent">
                    
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-[#F5F5F7] mb-6">
                      {/* 🔥 PERF : sizes et priority conservés 🔥 */}
                      {post.mainImage && (
                        <Image 
                          src={urlFor(post.mainImage).url()} 
                          alt={`Illustration : ${post.title}`} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 4}
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}

                      {post.cat && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-[#111111] shadow-sm z-10">
                          {post.cat}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 px-2">
                      {/* 🔥 DESIGN : Titres adoucis, police propre 🔥 */}
                      <h2 className="text-[18px] md:text-[20px] font-bold tracking-tight leading-snug text-[#111111] group-hover:text-[#0066CC] transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-3 font-medium flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-[11px] font-bold uppercase tracking-widest text-[#111111] group-hover:text-[#0066CC] transition-colors">
                        Lire l'article <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>

                  </Link>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}