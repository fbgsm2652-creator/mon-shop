/**
 * @meta_keywords Live Content API, Sanity Fetch, Real-time Update, RENW Infrastructure
 */

import "server-only"; // Sécurité pour s'assurer que ça ne tourne que côté serveur
import { defineLive } from "next-sanity/live";
import { client } from './client';

// On récupère le token de lecture (s'il existe)
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: '2024-01-01',
    useCdn: false, // Le Live API nécessite des données fraîches, pas de CDN
  }),
  serverToken: token || undefined,
  browserToken: token || undefined,
});