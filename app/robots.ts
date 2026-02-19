import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/studio/',   // Interface Sanity
        '/admin/',    // Routes admin éventuelles
        '/panier/',   // Page panier (doublon de /cart)
        '/cart/',     // Page panier
        '/checkout/', // Tunnel de commande (très important de bloquer)
        '/sign-in/',  // Page de connexion Clerk
        '/sign-up/',  // Page d'inscription Clerk
        '/mon-compte/' // Espace client privé
      ],
    },
    sitemap: 'https://renw.fr/sitemap.xml',
  };
}