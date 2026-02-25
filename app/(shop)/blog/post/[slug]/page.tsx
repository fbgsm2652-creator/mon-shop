import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- 1. METADATA DYNAMIQUES (SEO) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{title, excerpt, "ogImage": mainImage.asset->url}`,
    { slug } 
  );
  
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

// --- 2. DESIGN PREMIUM POUR LE CORPS DE L'ARTICLE (PortableText) ---
const components = {
  types: {
    image: ({ value }: any) => (
      <div className="relative w-full aspect-[16/9] my-10 overflow-hidden rounded-[1.5rem] bg-[#F5F5F7]">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Illustration article RENW"}
          fill
          sizes="(max-width: 768px) 100vw, 800px" 
          className="object-cover"
        />
      </div>
    ),
  },
  block: {
    // 🔥 Sous-titres réduits pour rester logiques avec le H1 🔥
    h2: ({ children }: any) => <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight mt-12 mb-4 text-[#111111]">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-[18px] md:text-[22px] font-semibold tracking-tight mt-8 mb-3 text-[#111111]">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[15px] md:text-[17px] leading-[1.8] text-gray-700 mb-5 font-normal">{children}</p>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

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

  // Réintégration de la police officielle
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <main style={siteFont} className="bg-white min-h-screen pt-32 pb-24 antialiased">
      {/* SCHEMA JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.mainImage ? urlFor(post.mainImage).url() : "",
            "datePublished": post.publishedAt,
            "author": { "@type": "Organization", "name": "RENW" },
            "publisher": { "@type": "Organization", "name": "RENW", "logo": { "@type": "ImageObject", "url": "https://renw.fr/logo.png" } }
          })
        }}
      />

      <article className="max-w-4xl mx-auto px-4 md:px-6">
        {/* NAVIGATION / FIL D'ARIANE */}
        <nav className="flex items-center gap-2 mb-10">
          <Link href="/blog" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#0066CC] transition-colors">Le Mag</Link>
          <span className="text-gray-300 text-[10px]">/</span>
          {post.category && (
            <Link href={`/blog/${post.category.slug}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066CC]">
              {post.category.title}
            </Link>
          )}
        </nav>

        {/* HEADER ARTICLE - 🔥 TITRE H1 RÉDUIT DE 50% 🔥 */}
        <header className="mb-10">
          <h1 className="text-[26px] md:text-[34px] font-bold tracking-tight leading-snug mb-4 text-[#111111]">
            {post.title}<span className="text-[#0066CC]">.</span>
          </h1>
          <p className="text-[16px] md:text-[18px] font-medium text-gray-500 leading-relaxed border-l-4 border-[#0066CC] pl-5">
            {post.excerpt}
          </p>
        </header>

        {/* IMAGE PRINCIPALE OPTIMISÉE */}
        {post.mainImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] mb-12 bg-[#F5F5F7] shadow-sm">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        )}

        {/* CORPS DE L'ARTICLE */}
        <div className="max-w-3xl mx-auto selection:bg-[#F0F7FF]">
          <PortableText value={post.content} components={components} />
        </div>

        {/* SECTION COMMERCE (PRODUITS LIÉS) */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <section className="mt-20 pt-14 border-t border-gray-100">
            <h2 className="text-[20px] font-bold tracking-tight mb-8 text-[#111111]">
              Produits <span className="text-[#0066CC]">associés.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {post.relatedProducts.map((product: any) => (
                <Link key={product._id} href={`/${product.slug}`} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-[1.5rem] hover:bg-white hover:shadow-[0_10px_30px_rgba(0,102,204,0.06)] transition-all duration-300 border border-transparent hover:border-[#0066CC]/20 group">
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden p-2 shadow-sm shrink-0 relative border border-gray-50">
                    {product.images && (
                      <Image 
                        src={urlFor(product.images[0]).url()} 
                        alt={product.name} 
                        fill
                        sizes="80px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-[#111111] leading-tight line-clamp-2">{product.name}</h3>
                    <p className="text-[#0066CC] font-bold text-[13px] mt-1.5">Dès {product.basePrice}€</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 block group-hover:text-[#0066CC] transition-colors">Découvrir →</span>
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