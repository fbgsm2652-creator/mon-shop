// app/(shop)/blog/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Metadata } from "next";

// --- AJOUT : METADATA POUR LE RÉFÉRENCEMENT DU MAG ---
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

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* GAUCHE : NAVIGATION DU MAG (Sidebar) */}
          <aside className="lg:w-1/4">
            <div className="sticky top-40 space-y-12">
              <header> {/* SEO : Sémantique header d'aside */}
                <h1 className="text-[45px] font-[1000] tracking-tighter leading-none mb-4 uppercase italic">
                  Le Mag<span className="text-blue-600">.</span>
                </h1>
                <p className="text-gray-400 text-[14px] leading-relaxed italic">
                  {data.config?.heroSubtitle || "L'expertise RENW : Tutoriels, analyses et tests pour durer."}
                </p>
              </header>

              <nav className="flex flex-col space-y-4" aria-label="Catégories du blog">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Thématiques</p>
                <Link href="/blog" className="text-[15px] font-bold text-blue-600">
                  Toutes les actus
                </Link>
                
                {data.categories?.map((cat: any) => (
                  <Link 
                    key={cat._id} 
                    href={`/blog/${cat.slug.current}`} 
                    className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between group"
                  >
                    {cat.title}
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </Link>
                ))}
              </nav>

              <div className="p-8 bg-[#FAFAFA] rounded-[2rem] border border-gray-100">
                <p className="text-[12px] font-bold mb-3">Une question technique ?</p>
                <Link href="/contact" className="text-[11px] font-black uppercase tracking-widest text-blue-600 underline">
                  Contactez nos experts
                </Link>
              </div>
            </div>
          </aside>

          {/* DROITE : FLUX D'ARTICLES (Grid) */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
              {data.posts?.map((post: any) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/post/${post.slug}`} aria-label={`Lire l'article : ${post.title}`}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-[#FAFAFA] mb-6 transition-all duration-500 group-hover:shadow-2xl">
                      <img 
                        src={urlFor(post.mainImage).url()} 
                        alt={`Image de couverture : ${post.title}`} // SEO : Alt descriptif
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy"
                      />
                      {post.cat && (
                        <span className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                          {post.cat}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[24px] font-bold tracking-tight leading-tight group-hover:text-blue-600 transition-colors mb-3">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-[15px] line-clamp-2 leading-relaxed mb-4 italic">
                      {post.excerpt}
                    </p>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#111111] border-b-2 border-[#111111] pb-1 group-hover:text-blue-600 group-hover:border-blue-600 transition-all">
                      Lire l'article
                    </span>
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