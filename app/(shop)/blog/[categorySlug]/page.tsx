// app/(shop)/blog/category/[categorySlug]/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;
  
  const category = await client.fetch(
    `*[_type == "blogCategory" && slug.current == $categorySlug][0]{title, description}`,
    { categorySlug }
  );
  
  if (!category) return { title: "Catégorie non trouvée | RENW" };

  return {
    title: `${category.title} | Le Mag RENW`,
    description: category.description || `Découvrez nos articles sur la thématique : ${category.title}`,
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;

  const data = await client.fetch(`{
    "category": *[_type == "blogCategory" && slug.current == $categorySlug][0],
    "posts": *[_type == "post" && blogCategory->slug.current == $categorySlug] | order(publishedAt desc){
      title,
      "slug": slug.current,
      mainImage,
      excerpt
    }
  }`, { categorySlug });

  if (!data.category) notFound();

  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <main style={siteFont} className="bg-white min-h-screen pt-40 pb-24 text-[#111111] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://renw.fr" },
              { "@type": "ListItem", "position": 2, "name": "Le Mag", "item": "https://renw.fr/blog" },
              { "@type": "ListItem", "position": 3, "name": data.category.title }
            ]
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-20 max-w-3xl">
          <Link href="/blog" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066CC] hover:opacity-70 transition-all mb-6 inline-block">
            ← Retour au Mag
          </Link>
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-none mb-6 text-[#111111] uppercase">
            {data.category.title}<span className="text-[#0066CC]">.</span>
          </h1>
          {data.category.description && (
            <p className="text-gray-500 text-[16px] leading-relaxed font-medium">
              {data.category.description}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {data.posts.map((post: any, index: number) => (
            <article key={post.slug} className="group flex flex-col h-full">
              <Link href={`/blog/post/${post.slug}`} className="flex flex-col h-full bg-white rounded-[2rem] p-4 md:p-5 transition-all duration-500 shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50 hover:border-transparent">
                
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-[#F5F5F7] mb-6">
                  {post.mainImage && (
                    <Image 
                      src={urlFor(post.mainImage).url()} 
                      alt={post.title} 
                      fill
                      priority={index < 3}
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>

                <div className="flex flex-col flex-1 px-2">
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
    </main>
  );
}