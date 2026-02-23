import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";
import CategoryPageDisplay from "@/components/CategoryPageDisplay";
import { Metadata } from "next";

// --- 1. GÉNÉRATION DES METADATA (SEO DYNAMIQUE - 10/10) ---
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

// --- 2. LE COMPOSANT DYNAMIQUE ---
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
      "slug": slug.current,
      "mainImage": coalesce(mainImage, images[0]), 
      
      "crossSell": crossSell->{
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
        // 🔥 SEO MAILLAGE VERTICAL : On charge TOUS les produits associés avec leur prix pour le composant
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

      // 🔥 SEO MAILLAGE HORIZONTAL : On récupère les best-sellers définis dans la page d'accueil
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
      breadcrumbList.push({ 
        position: 2, 
        name: data.category.title, 
        item: `https://renw.fr/categories/${data.category.slug}` 
      });
    }
    breadcrumbList.push({ 
      position: data.category ? 3 : 2, 
      name: data.name || data.title, 
      item: `https://renw.fr/${slug}` 
    });
  } else if (data._type === "category") {
    breadcrumbList.push({ 
      position: 2, 
      name: data.title || data.name, 
      item: `https://renw.fr/categories/${slug}` 
    });
  }

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
    </>
  );
}