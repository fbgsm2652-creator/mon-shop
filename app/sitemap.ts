import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Sitemap mis en cache 1h, régénéré en arrière-plan si le contenu change
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://renw.fr';

  const query = `{
    "products": *[_type == "product" && defined(slug.current)] { "slug": slug.current, _updatedAt },
    "categories": *[_type == "category" && defined(slug.current)] { "slug": slug.current, _updatedAt },
    "posts": *[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt },
    "infoPages": *[_type == "page" && defined(slug.current)] { "slug": slug.current, _updatedAt }
  }`;

  const data = await client.fetch(query);

  // 2. URLS PRODUITS (URLs courtes à la racine)
  const productUrls = data.products.map((p: any) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: new Date(p._updatedAt || new Date()), // Sécurité anti-crash
    changeFrequency: 'daily' as const,
    priority: 0.9, 
  }));

  // 3. URLS CATÉGORIES (URLs courtes à la racine)
  const categoryUrls = data.categories.map((c: any) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: new Date(c._updatedAt || new Date()), // Sécurité anti-crash
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. URLS DU MAG (BLOG)
  const blogUrls = data.posts.map((post: any) => ({
    url: `${baseUrl}/blog/post/${post.slug}`,
    lastModified: new Date(post._updatedAt || new Date()), // Sécurité anti-crash
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 5. PAGES INFO (CGV, mentions légales, etc.)
  const infoUrls = data.infoPages.map((p: any) => ({
    url: `${baseUrl}/info/${p.slug}`,
    lastModified: new Date(p._updatedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  // 6. PAGES STATIQUES STRATÉGIQUES
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  return [...staticUrls, ...categoryUrls, ...productUrls, ...blogUrls, ...infoUrls];
}