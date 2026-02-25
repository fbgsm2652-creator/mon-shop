import { type SchemaTypeDefinition } from 'sanity'

// 1. Imports des modèles
import { product } from './product'
import { category } from './category'
import { post } from './post' 
import order from './order' 
import { homeSettings } from './homeSettings' 
import headerSettings from './headerSettings'
import footerSettings from './footerSettings'
import settings from './settings' 
import shippingMethod from './shipping'

// 🔥 CORRECTION ICI : On remet bien "./customer" comme à l'origine
import customer from './customer'

// 🔥 Ton nouveau fichier pour les pages libres
import infoPage from './infoPage'

// 2. Schémas secondaires du Mag (Optimisés SEO)
const blogCategory: SchemaTypeDefinition = {
  name: 'blogCategory',
  title: 'Le Mag - Catégories',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Titre de la catégorie', 
      type: 'string', 
      validation: (Rule) => Rule.required() 
    },
    { 
      name: 'slug', 
      title: 'Slug (URL)', 
      type: 'slug', 
      options: { source: 'title' },
      validation: (Rule) => Rule.required() 
    },
    {
      name: 'description',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      description: 'Apparaît dans les résultats Google.'
    }
  ]
}

const blogHome: SchemaTypeDefinition = {
  name: 'blogHome',
  title: 'Le Mag - Configuration',
  type: 'document',
  fields: [
    { 
      name: 'heroTitle', 
      title: 'Titre H1 du Blog', 
      type: 'string',
      description: 'Le titre principal pour le SEO du Mag.'
    },
    { 
      name: 'metaDescription', 
      title: 'Meta Description du Mag', 
      type: 'text', 
      rows: 2 
    },
    { 
      name: 'featuredPosts', 
      title: 'Articles à la une', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'post' }] }] 
    },
  ]
}

// 3. Exportation vers le Studio
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Configuration Globale
    homeSettings as SchemaTypeDefinition,
    headerSettings as SchemaTypeDefinition,
    footerSettings as SchemaTypeDefinition,
    settings as SchemaTypeDefinition,

    // Boutique 
    product, 
    category, 
    order as SchemaTypeDefinition, 
    customer as SchemaTypeDefinition,
    shippingMethod as SchemaTypeDefinition,
    
    // 🔥 AJOUT ICI : Les pages informatives
    infoPage as SchemaTypeDefinition,

    // Le Mag 
    post, 
    blogCategory, 
    blogHome,
  ],
}