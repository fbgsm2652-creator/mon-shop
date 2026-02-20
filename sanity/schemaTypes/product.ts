import { defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export const product = defineType({
  name: 'product',
  title: 'Produits',
  type: 'document',
  icon: Package,
  groups: [
    { name: 'seo', title: 'SEO & Tracking' },
    { name: 'inventory', title: 'Stock & Prix' },
    { name: 'content', title: 'Visuels & Contenu' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du produit',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU / Référence unique',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      options: { 
        source: 'name', 
        maxLength: 96,
        slugify: input => input
                         .toLowerCase()
                         .normalize("NFD")
                         .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
                         .replace(/\s+/g, '-') // Remplace les espaces par des tirets
                         .slice(0, 96)
      },
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO OPTIMISÉ (AVEC WARNINGS GOOGLE) ---
    defineField({ name: 'headerScript', title: 'Script Header', type: 'text', group: 'seo', rows: 3 }),
    defineField({ 
      name: 'metaTitle', 
      title: 'Meta Title', 
      type: 'string', 
      group: 'seo',
      validation: Rule => Rule.max(60).warning('Attention: Google coupe souvent les titres après 60 caractères.')
    }),
    defineField({ name: 'metaKeywords', title: 'Meta Keywords', type: 'string', group: 'seo' }),
    defineField({ 
      name: 'metaDescription', 
      title: 'Meta Description', 
      type: 'text', 
      group: 'seo', 
      rows: 2,
      validation: Rule => Rule.max(160).warning('Attention: Google coupe souvent les descriptions après 160 caractères.')
    }),

    // --- CONFIGURATION ---
    defineField({
      name: 'isReconditioned',
      title: 'Produit Reconditionné ?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'colors',
      title: 'Couleurs disponibles',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),

    // --- PRIX & STOCK ---
    defineField({
      name: 'price',
      title: 'Prix de vente TTC (fixe)',
      type: 'number',
      group: 'inventory',
      hidden: ({ document }) => !!document?.isReconditioned || (document?.simpleVariants as any[])?.length > 0,
    }),
    
    defineField({
      name: 'simpleVariants',
      title: 'Variantes de produit (ex: Original vs Compatible)',
      type: 'array',
      group: 'inventory',
      hidden: ({ document }) => !!document?.isReconditioned,
      of: [{
        type: 'object',
        fields: [
          { name: 'variantName', title: 'Nom (ex: Original)', type: 'string' },
          { name: 'price', title: 'Prix TTC', type: 'number' },
          { name: 'stock', title: 'Stock', type: 'number' },
          { name: 'purchasePrice', title: 'Prix d\'achat', type: 'number' },
        ]
      }]
    }),

    defineField({
      name: 'grades',
      title: 'Configuration Reconditionnée',
      type: 'array',
      group: 'inventory',
      hidden: ({ document }) => !document?.isReconditioned,
      of: [{
        type: 'object',
        fields: [
          { name: 'gradeName', title: 'Nom du Grade', type: 'string' },
          {
            name: 'capacities',
            title: 'Variantes de stockage',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'storage', title: 'Capacité', type: 'string' },
                { name: 'price', title: 'Prix de vente', type: 'number' },
                { name: 'purchasePrice', title: 'Prix d\'achat', type: 'number' },
                { name: 'stock', title: 'Stock disponible', type: 'number' },
              ]
            }]
          }
        ]
      }]
    }),

    // --- VISUELS & CONTENU ---
    // AJOUT SEO : Le champ "alt" pour la mainImage
    defineField({ 
      name: 'mainImage', 
      title: 'Image Principale', 
      type: 'image', 
      group: 'content', 
      options: { hotspot: true }, 
      fields: [
        { name: 'alt', title: 'Texte Alternatif (SEO)', type: 'string', description: 'Important pour Google Images (Ex: "iPhone 13 Bleu Reconditionné")' }
      ],
      validation: (Rule) => Rule.required() 
    }),
    defineField({ name: 'images', title: 'Galerie Photos', type: 'array', group: 'content', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'colorAssoc', title: 'Couleur associée', type: 'string' }, { name: 'alt', title: 'Texte Alternatif (SEO)', type: 'string' }] }] }),
    defineField({ name: 'shortDescription', title: 'Texte d\'accroche', type: 'text', rows: 2, group: 'content' }),
    
    // BLOC : ARGUMENTS DE VENTE (RÉASSURANCE)
    defineField({
      name: 'productFeatures',
      title: 'Arguments de vente (Réassurance)',
      description: 'Ajoutez jusqu\'à 3 arguments (ex: "Batterie certifiée", "Garantie 2 ans"). Laissez vide pour ne rien afficher.',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Icône (Emoji)', type: 'string', description: 'Ex: 🛡️, 🔋, ⚡, ♻️' },
          { name: 'text', title: 'Texte de l\'argument', type: 'string' }
        ],
        preview: {
          select: { title: 'text', subtitle: 'icon' },
          prepare(selection) { return { title: `${selection.subtitle || '✅'} ${selection.title}` } }
        }
      }]
    }),

    defineField({ name: 'content', title: 'Description détaillée', type: 'array', group: 'content', of: [{ type: 'block' }] }),
    defineField({ name: 'faq', title: 'FAQ Produit', type: 'array', of: [{ type: 'object', fields: [{ name: 'question', title: 'Question', type: 'string' }, { name: 'answer', title: 'Réponse', type: 'text' }] }] }),
    defineField({ name: 'relatedProducts', title: 'Produits Associés', type: 'array', group: 'content', validation: (Rule) => Rule.max(3), of: [{ type: 'reference', to: [{ type: 'product' }] }] }),
  ],
  preview: { select: { title: 'name', media: 'mainImage' } }
})