import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN activé pour les lectures publiques (performances + cache)
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
})