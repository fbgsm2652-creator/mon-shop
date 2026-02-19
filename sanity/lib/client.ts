import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  useCdn: false, 
  // On récupère le token. 
  // Note : Il ne sera accessible que si l'appel est fait côté serveur ou via une API
  token: process.env.SANITY_API_TOKEN, 
  ignoreBrowserTokenWarning: true,
})