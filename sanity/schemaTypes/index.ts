import { type SchemaTypeDefinition } from 'sanity'

// 1. Imports des modèles
// Note : Assure-toi que ces fichiers utilisent "export const product = ..." 
// ou adapte l'import si c'est du "export default"
import { product } from './product'
import { category } from './category'
import { post } from './post' 
import order from './order' 
import { homeSettings } from './homeSettings' // Corrigé pour correspondre à mon export précédent
import headerSettings from './headerSettings'
import footerSettings from './footerSettings'
import customer from './customer'
import settings from './settings' 
import shippingMethod from './shipping'

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
    // Configuration Globale (Priorité Admin)
    homeSettings as SchemaTypeDefinition,
    headerSettings as SchemaTypeDefinition,
    footerSettings as SchemaTypeDefinition,
    settings as SchemaTypeDefinition,

    // Boutique (Cœur du business)
    product, 
    category, 
    order as SchemaTypeDefinition, 
    customer as SchemaTypeDefinition,
    shippingMethod as SchemaTypeDefinition,
    
    // Le Mag (SEO Content)
    post, 
    blogCategory, 
    blogHome,
  ],
}