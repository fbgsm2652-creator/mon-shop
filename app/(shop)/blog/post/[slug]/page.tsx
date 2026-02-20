import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- 1. METADATA DYNAMIQUES (SEO) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{title, excerpt, "ogImage": mainImage.asset->url}`);
  
  if (!post) return { title: "Article non trouvé | RENW" };

  return {
    title: `${post.title} | Le Mag RENW`,
    description: post.excerpt || "Conseils et expertise sur la technologie reconditionnée par RENW.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.ogImage ? [{ url: post.ogImage }] : [],
      type: "article",
    },
  };
}

// --- 2. CONFIGURATION PORTABLE TEXT (DESIGN) ---
const components = {
  types: {
    image: ({ value }: any) => (
      <div className="relative w-full aspect-video my-12 overflow-hidden rounded-[2rem] shadow-lg">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Illustration article RENW"}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-[32px] font-[1000] tracking-tighter mt-16 mb-6 text-[#111111]">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-[24px] font-bold tracking-tight mt-10 mb-4 text-[#111111]">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[18px] leading-[1.8] text-gray-700 mb-6 font-medium">{children}</p>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      mainImage,
      content,
      excerpt,
      "category": blogCategory->{title, "slug": slug.current},
      "relatedProducts": relatedProducts[]->{
        _id,
        name,
        "slug": slug.current,
        images,
        "basePrice": grades[0].capacities[0].price
      }
    }
  `, { slug });

  if (!post) notFound();

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      {/* SCHEMA JSON-LD (SEO ELITE) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": urlFor(post.mainImage).url(),
            "datePublished": post.publishedAt,
            "author": { "@type": "Organization", "name": "RENW" },
            "publisher": { "@type": "Organization", "name": "RENW", "logo": { "@type": "ImageObject", "url": "https://renw.fr/logo.png" } }
          })
        }}
      />

      <article className="max-w-4xl mx-auto px-4 md:px-6">
        {/* NAVIGATION / FIL D'ARIANE */}
        <nav className="flex items-center gap-2 mb-8">
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Le Mag</Link>
          <span className="text-gray-300 text-[10px]">/</span>
          {post.category && (
            <Link href={`/blog/${post.category.slug}`} className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              {post.category.title}
            </Link>
          )}
        </nav>

        {/* HEADER */}
        <header className="mb-16">
          <h1 className="text-[45px] md:text-[65px] font-[1000] tracking-tighter leading-[0.95] mb-10 text-[#111111]">
            {post.title}<span className="text-blue-600">.</span>
          </h1>
          <p className="text-[20px] text-gray-500 italic leading-relaxed border-l-4 border-blue-600 pl-8">
            {post.excerpt}
          </p>
        </header>

        {/* IMAGE PRINCIPALE OPTIMISÉE */}
        {post.mainImage && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[3.5rem] mb-20 shadow-2xl shadow-blue-500/5">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* CORPS DE L'ARTICLE */}
        <div className="max-w-3xl mx-auto selection:bg-blue-100">
          <PortableText value={post.content} components={components} />
        </div>

        {/* SECTION COMMERCE (PRODUITS LIÉS) */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <section className="mt-32 pt-20 border-t border-gray-100">
            <h2 className="text-[26px] font-[1000] uppercase tracking-tighter mb-12 text-center italic">
              L'équipement <span className="text-blue-600 text-3xl">certifié.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {post.relatedProducts.map((product: any) => (
                <Link key={product._id} href={`/${product.slug}`} className="flex items-center gap-6 p-6 bg-[#F5F5F7] rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-transparent hover:border-blue-100 group">
                  <div className="w-28 h-28 bg-white rounded-[1.8rem] overflow-hidden p-3 shadow-sm">
                    {product.images && (
                      <Image 
                        src={urlFor(product.images[0]).url()} 
                        alt={product.name} 
                        width={100} 
                        height={100} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-[17px] text-[#111111] leading-tight">{product.name}</h3>
                    <p className="text-blue-600 font-black text-[15px] mt-1.5">Dès {product.basePrice}€</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3 block group-hover:text-blue-600 transition-colors">Découvrir →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}