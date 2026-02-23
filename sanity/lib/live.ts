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
    useCdn: false, // Obligatoire pour le Live (données fraîches, pas de cache)
  }),
  // LA CORRECTION MAGIQUE : 
  // Si 'token' n'existe pas, on passe 'false'. L'avertissement disparaît instantanément !
  serverToken: token || false,
  browserToken: token || false,
});