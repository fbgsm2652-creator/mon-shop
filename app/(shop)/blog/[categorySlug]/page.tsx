import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- AJOUT : METADATA DYNAMIQUES POUR GOOGLE ---
export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await client.fetch(`*[_type == "blogCategory" && slug.current == $categorySlug][0]`, { categorySlug });

  if (!category) return { title: "Catégorie non trouvée" };

  return {
    title: `${category.title} | Le Mag RENW`,
    description: category.description || `Découvrez tous nos articles et conseils sur ${category.title}.`,
    openGraph: {
      title: `${category.title} | Le Mag RENW`,
      description: category.description,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;

  const data = await client.fetch(`{
    "category": *[_type == "blogCategory" && slug.current == $categorySlug][0],
    "posts": *[_type == "post" && blogCategory->slug.current == $categorySlug] | order(publishedAt desc){
      title,
      "slug": slug.current,
      mainImage,
      excerpt,
      "catTitle": blogCategory->title
    }
  }`, { categorySlug });

  if (!data.category) notFound();

  return (
    <main className="bg-white min-h-screen pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
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

        {data.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {data.posts.map((post: any) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/post/${post.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-[#FAFAFA] mb-6 transition-all duration-500 group-hover:shadow-2xl">
                    <img 
                      src={urlFor(post.mainImage).url()} 
                      alt={`Article sur ${post.title}`} // SEO : Alt descriptif renforcé
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      loading="lazy" // SEO : Performance
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
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-[3.5rem]">
            <p className="text-gray-400 font-bold text-[18px]">Aucun article dans cette thématique pour le moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}