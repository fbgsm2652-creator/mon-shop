import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image"; // Importation du composant optimisé
import { notFound } from "next/navigation";
import { Metadata } from "next";

// ... generateMetadata reste identique ...

export default async function BlogCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;

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

  return (
    <main className="bg-white min-h-screen pt-40 pb-24">
      {/* JSON-LD BREADCRUMB */}
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
        {/* HEADER ET GRILLE (Gardés à 100% selon ton design) */}
        <header className="mb-20 max-w-3xl">
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 hover:opacity-70 transition-all mb-8 inline-block">
            ← Retour au Mag
          </Link>
          <h1 className="text-[50px] md:text-[75px] font-[1000] tracking-tighter leading-[0.9] mb-8 text-[#111111]">
            {data.category.title}<span className="text-blue-600">.</span>
          </h1>
          {data.category.description && (
            <p className="text-gray-500 text-[18px] leading-relaxed italic">
              {data.category.description}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.posts.map((post: any) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/post/${post.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-[#FAFAFA] mb-6 transition-all duration-500 group-hover:shadow-2xl">
                  <Image 
                    src={urlFor(post.mainImage).url()} 
                    alt={post.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h2 className="text-[22px] font-bold tracking-tight leading-tight group-hover:text-blue-600 transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-[14px] line-clamp-2 leading-relaxed mb-4">
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
    </main>
  );
}