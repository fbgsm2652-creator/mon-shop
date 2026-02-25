// app/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";
import CategoryPageDisplay from "@/components/CategoryPageDisplay";
import { PortableText } from "@portabletext/react"; // 🔥 On importe l'outil pour lire ton texte Sanity
import { Metadata } from "next";
import Link from "next/link";

// --- 1. GÉNÉRATION DES METADATA (SEO DYNAMIQUE) ---
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const data = await client.fetch(`
    *[slug.current == $slug][0]{
      _type,
      name,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      "ogImage": coalesce(mainImage.asset->url, images[0].asset->url)
    }
  `, { slug });

  if (!data) return { title: "Page non trouvée | RENW" };

  const displayTitle = data.metaTitle || `${data.name || data.title} - Expertise Certifiée | RENW`;
  const displayDesc = data.metaDescription || `Découvrez notre sélection de ${data.name || data.title}. Qualité certifiée RENW, expédition rapide.`;

  return {
    title: displayTitle,
    description: displayDesc,
    keywords: data.metaKeywords ? data.metaKeywords.split(',').map((k: string) => k.trim()) : ["reconditionné", "RENW France", data.name || data.title],
    alternates: { canonical: `https://renw.fr/${slug}` },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: displayTitle,
      description: displayDesc,
      url: `https://renw.fr/${slug}`,
      siteName: "RENW",
      images: data.ogImage ? [{ url: data.ogImage }] : [],
      type: "website",
    },
  };
}

// --- 2. COMPOSANTS DE DESIGN POUR LES PAGES LIBRES (CGV, etc.) ---
const infoPageComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight mt-12 mb-6 text-[#111111]">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight mt-10 mb-4 text-[#111111]">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight mt-8 mb-3 text-[#111111]">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[15px] md:text-[16px] leading-[1.8] text-gray-600 mb-5 font-medium">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[15px] md:text-[16px] leading-[1.8] text-gray-600 font-medium">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[15px] md:text-[16px] leading-[1.8] text-gray-600 font-medium">{children}</ol>,
  },
};

// --- 3. LE COMPOSANT DYNAMIQUE ---
export default async function DynamicPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const data = await client.fetch(`
    *[slug.current == $slug][0]{
      ...,
      _type,
      _id,
      name,
      title,
      content,
      "slug": slug.current,
      "mainImage": coalesce(mainImage, images[0]), 
      
      "crossSell": crossSell[]->{
        _id,
        name,
        isReconditioned,
        price,
        mainImage,
        images,
        grades,
        simpleVariants
      },
      
      "category": category-> {
        title,
        "slug": slug.current,
        "relatedProducts": *[_type == "product" && references(^._id) && slug.current != $slug] | order(_createdAt desc) {
          _id,
          name,
          "slug": slug.current,
          "mainImage": coalesce(mainImage.asset->url, images[0].asset->url),
          "minPrice": select(
            isReconditioned == true => grades[0].capacities[0].price,
            price > 0 => price,
            0
          )
        }
      },

      "relatedProducts": relatedProducts[]->{
        _id,
        name,
        "slug": slug,
        "mainImage": coalesce(mainImage, images[0])
      },

      "bestSellers": *[_type == "homeSettings"][0].bestSellers[]->{
        _id,
        name,
        "slug": slug.current,
        "mainImage": coalesce(mainImage.asset->url, images[0].asset->url),
        "minPrice": select(
          isReconditioned == true => grades[0].capacities[0].price,
          price > 0 => price,
          0
        )
      },

      "categoryProducts": *[_type == "product" && (category->slug.current == $slug || brand == $slug)] | order(_createdAt desc) {
        _id,
        name,
        "slug": slug.current,
        "mainImage": coalesce(mainImage.asset->url, images[0].asset->url),
        "minPrice": select(
          isReconditioned == true => grades[0].capacities[0].price,
          price > 0 => price,
          0
        )
      }
    }
  `, { slug });

  if (!data) return notFound();

  const breadcrumbList = [
    { position: 1, name: "Accueil", item: "https://renw.fr" },
  ];

  if (data._type === "product") {
    if (data.category) {
      breadcrumbList.push({ position: 2, name: data.category.title, item: `https://renw.fr/categories/${data.category.slug}` });
    }
    breadcrumbList.push({ position: data.category ? 3 : 2, name: data.name || data.title, item: `https://renw.fr/${slug}` });
  } else if (data._type === "category") {
    breadcrumbList.push({ position: 2, name: data.title || data.name, item: `https://renw.fr/categories/${slug}` });
  } else if (data._type === "infoPage") {
    breadcrumbList.push({ position: 2, name: data.title, item: `https://renw.fr/${slug}` });
  }

  // Police officielle RENW
  const siteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbList.map((b) => ({
            "@type": "ListItem",
            "position": b.position,
            "name": b.name,
            "item": b.item,
          })),
        }) }}
      />
      
      {data._type === "product" && <ProductPageClient product={data} />}
      {data._type === "category" && <CategoryPageDisplay category={data} />}
      
      {/* 🔥 NOUVEAU : LE DESIGN DE TES PAGES LIBRES 🔥 */}
      {data._type === "infoPage" && (
        <main style={siteFont} className="bg-white min-h-screen pt-32 pb-24 antialiased selection:bg-[#F0F7FF]">
          <article className="max-w-3xl mx-auto px-4 md:px-6">
            
            <header className="mb-12 border-b border-gray-100 pb-8">
              <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight text-[#111111] leading-tight">
                {data.title}<span className="text-[#0066CC]">.</span>
              </h1>
            </header>

            <div className="prose-custom">
              {data.content ? (
                <PortableText value={data.content} components={infoPageComponents} />
              ) : (
                <p className="text-gray-500 italic">Le contenu de cette page est en cours de rédaction.</p>
              )}
            </div>

          </article>
        </main>
      )}
    </>
  );
}