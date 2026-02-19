import { type SchemaTypeDefinition } from 'sanity'

// 1. Imports des modèles existants
import { product } from './product'
import { category } from './category'
import { post } from './post' 
import order from './order' 
import transportSettings from './transportSettings' 
import homeSettings from './homeSettings' 

// --- NOUVEAUX IMPORTS POUR LE DESIGN ---
import headerSettings from './headerSettings'
import footerSettings from './footerSettings'

// --- SCHÉMA : PARAMÈTRES GÉNÉRAUX & SEO (OPTIMISÉ 1000%) ---
const settings: SchemaTypeDefinition = {
  name: 'settings',
  title: 'Paramètres du Site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité & SEO' },
    { name: 'legal', title: 'Infos Légales' },
  ],
  fields: [
    { 
      name: 'companyName', 
      title: 'Nom de l\'entreprise', 
      type: 'string', 
      group: 'identity',
      description: 'Utilisé pour le SEO et le nom du site.'
    },
    { 
      name: 'baseUrl', 
      title: 'URL du site (Domaine)', 
      type: 'url', 
      group: 'identity',
      description: 'Ex: https://renw.fr (Nécessaire pour le SEO Global).'
    },
    {
      name: 'globalSeo',
      title: 'SEO Global (Fallback)',
      type: 'object',
      group: 'identity',
      fields: [
        { name: 'metaTitle', title: 'Titre Meta par défaut', type: 'string' },
        { name: 'metaDescription', title: 'Description Meta par défaut', type: 'text', rows: 3 },
      ]
    },
    { 
      name: 'address', 
      title: 'Adresse de l\'entreprise', 
      type: 'text', 
      group: 'legal',
      description: 'Cette adresse apparaîtra sur vos factures PDF' 
    },
    { name: 'siret', title: 'SIRET / Infos Légales', type: 'string', group: 'legal' },
    { 
      name: 'invoiceLogo', 
      title: 'Logo Facture', 
      type: 'image', 
      group: 'legal',
      options: { hotspot: true } 
    },
  ]
}

// --- SCHÉMA CLIENT ---
const customer: SchemaTypeDefinition = {
  name: 'customer',
  title: 'Clients',
  type: 'document',
  fields: [
    { name: 'clerkId', title: 'Clerk ID', type: 'string' },
    { name: 'firstName', title: 'Prénom', type: 'string' },
    { name: 'lastName', title: 'Nom', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    {
      name: 'addresses',
      title: 'Adresses',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'street', title: 'Rue', type: 'string' },
          { name: 'city', title: 'Ville', type: 'string' },
          { name: 'zipCode', title: 'Code Postal', type: 'string' },
          { name: 'country', title: 'Pays', type: 'string', initialValue: 'France' },
          { name: 'isDefault', title: 'Par défaut', type: 'boolean' }
        ]
      }]
    }
  ]
}

// --- SCHÉMAS POUR LE MAG (BLOG) ---
const blogCategory: SchemaTypeDefinition = {
  name: 'blogCategory',
  title: 'Le Mag - Catégories',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre de la catégorie', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
    { name: 'description', title: 'Description SEO', type: 'text', rows: 3 },
  ]
}

const blogHome: SchemaTypeDefinition = {
  name: 'blogHome',
  title: 'Le Mag - Configuration Accueil',
  type: 'document',
  fields: [
    { name: 'heroTitle', title: 'Titre de bienvenue (H1)', type: 'string' },
    { name: 'heroSubtitle', title: 'Sous-titre de présentation', type: 'text', rows: 2 },
    { name: 'featuredPosts', title: 'Articles à la une (Slider)', type: 'array', of: [{ type: 'reference', to: [{ type: 'post' }] }] },
    { name: 'bannerImage', title: 'Image de fond / Illustration Hero', type: 'image', options: { hotspot: true } }
  ]
}

// --- SCHÉMAS LOGISTIQUE & TECHNIQUE ---
const transport: SchemaTypeDefinition = {
  name: 'transport',
  title: 'Logistique & Livraison',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom du transporteur', type: 'string' },
    { name: 'price', title: 'Frais de port (€)', type: 'number' },
    { name: 'delay', title: 'Délai estimé', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
  ]
}

const zenPasserelle: SchemaTypeDefinition = {
  name: 'zenPasserelle',
  title: 'Passerelle ZEN',
  type: 'document',
  fields: [
    { name: 'zenTerminalId', title: 'ZEN Terminal ID', type: 'string' },
    { name: 'zenSecretKey', title: 'ZEN Secret Key', type: 'string' },
    { name: 'zenMode', title: 'ZEN API URL (Mode)', type: 'string', description: 'Prod ou Sandbox' },
  ]
}

// 2. Exportation de TOUS les types vers le Studio
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product, 
    category, 
    post, 
    customer,
    order, 
    settings,
    blogCategory, 
    blogHome,      
    transport, 
    zenPasserelle,
    transportSettings,
    homeSettings as SchemaTypeDefinition,
    headerSettings, 
    footerSettings  
  ],
}