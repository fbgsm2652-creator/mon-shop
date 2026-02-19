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
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO ---
    defineField({ name: 'headerScript', title: 'Script Header', type: 'text', group: 'seo', rows: 3 }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', group: 'seo' }),
    defineField({ name: 'metaKeywords', title: 'Meta Keywords', type: 'string', group: 'seo' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', group: 'seo', rows: 2 }),

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

    // --- PRIX & STOCK (PRODUIT SIMPLE AVEC VARIANTES) ---
    // On cache le prix fixe si on utilise des variantes simples
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

    // --- GRADES & CAPACITÉS (RECONDITIONNÉ) ---
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

    // --- LE RESTE (VISUELS / FAQ) RESTE INCHANGÉ ---
    defineField({ name: 'mainImage', title: 'Image Principale', type: 'image', group: 'content', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'images', title: 'Galerie Photos', type: 'array', group: 'content', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'colorAssoc', title: 'Couleur associée', type: 'string' }, { name: 'alt', title: 'Texte Alternatif (SEO)', type: 'string' }] }] }),
    defineField({ name: 'shortDescription', title: 'Texte d\'accroche', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'content', title: 'Description détaillée', type: 'array', group: 'content', of: [{ type: 'block' }] }),
    defineField({ name: 'faq', title: 'FAQ Produit', type: 'array', of: [{ type: 'object', fields: [{ name: 'question', title: 'Question', type: 'string' }, { name: 'answer', title: 'Réponse', type: 'text' }] }] }),
    defineField({ name: 'relatedProducts', title: 'Produits Associés', type: 'array', group: 'content', validation: (Rule) => Rule.max(3), of: [{ type: 'reference', to: [{ type: 'product' }] }] }),
  ],
  preview: { select: { title: 'name', media: 'mainImage' } }
})