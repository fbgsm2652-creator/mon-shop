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
                         .replace(/[\u0300-\u036f]/g, "")
                         .replace(/\s+/g, '-')
                         .slice(0, 96)
      },
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO OPTIMISÉ ---
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
      title: 'Produit Reconditionné / Téléphone ?',
      type: 'boolean',
      initialValue: true,
      description: 'Cochez pour un téléphone avec des grades (ex: Comme Neuf). Décochez pour une pièce détachée ou accessoire (ex: Écran, Batterie).',
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
      name: 'priceWhenNew',
      title: 'Prix d\'origine du neuf (Pour afficher le prix barré)',
      type: 'number',
      group: 'inventory',
      description: 'Ex: 817.21 (Permet de calculer l\'économie réalisée)'
    }),
    defineField({
      name: 'price',
      title: 'Prix de vente TTC (fixe)',
      type: 'number',
      group: 'inventory',
      hidden: ({ document }) => !!document?.isReconditioned || (document?.simpleVariants as any[])?.length > 0,
    }),
    
    // VARIANTES SIMPLES (Ex: Écran OLED vs Incell)
    defineField({
      name: 'simpleVariants',
      title: 'Variantes de produit (ex: Qualité Écran)',
      type: 'array',
      group: 'inventory',
      hidden: ({ document }) => !!document?.isReconditioned,
      of: [{
        type: 'object',
        fields: [
          { name: 'variantName', title: 'Nom (ex: OLED Soft)', type: 'string' },
          { name: 'price', title: 'Prix TTC', type: 'number' },
          { name: 'stock', title: 'Stock', type: 'number' },
          { name: 'purchasePrice', title: 'Prix d\'achat', type: 'number' },
          
          // 🔥 VOLET EXPLICATIF 100% PERSONNALISABLE POUR VARIANTES SIMPLES 🔥
          { name: 'drawerTitle', title: 'Titre principal du Volet (ex: Guide des Écrans)', type: 'string' },
          { name: 'drawerSubtitle', title: 'Sous-titre (Sous le nom du produit)', type: 'string' },
          { name: 'drawerImage', title: 'Image spécifique dans le volet (Optionnel)', type: 'image', options: { hotspot: true } },
          { 
            name: 'drawerDescription', 
            title: 'Description détaillée (Texte principal du volet)', 
            type: 'text', 
            rows: 3 
          },
          {
            name: 'drawerChecklist',
            title: 'Points forts (Bloc Gris avec coche bleue)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Ex: Luminosité maximale, Tactile ultra-réactif...'
          }
        ]
      }]
    }),

    // GRADES RECONDITIONNÉS (Ex: Téléphones)
    defineField({
      name: 'grades',
      title: 'Configuration Reconditionnée (Grades)',
      type: 'array',
      group: 'inventory',
      hidden: ({ document }) => !document?.isReconditioned,
      of: [{
        type: 'object',
        fields: [
          { name: 'gradeName', title: 'Nom du Grade (ex: Comme neuf)', type: 'string' },
          { name: 'gradeDescription', title: 'Petite description sous le bouton (ex: Écran parfait)', type: 'string' },
          
          // 🔥 VOLET EXPLICATIF 100% PERSONNALISABLE POUR GRADES 🔥
          { name: 'drawerTitle', title: 'Titre principal du Volet (ex: Guide des États)', type: 'string' },
          { name: 'drawerSubtitle', title: 'Sous-titre (Sous le nom du produit)', type: 'string' },
          { name: 'drawerImage', title: 'Image spécifique dans le volet (Optionnel)', type: 'image', options: { hotspot: true } },
          { 
            name: 'drawerDescription', 
            title: 'Description détaillée (Texte principal du volet)', 
            type: 'text', 
            rows: 3 
          },
          {
            name: 'drawerChecklist',
            title: 'Points forts (Bloc Gris avec coche bleue)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Ex: Batterie testée > 85%, Débloqué tout opérateur...'
          },
          {
            name: 'capacities',
            title: 'Variantes de stockage',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'storage', title: 'Capacité (ex: 128 Go)', type: 'string' },
                { name: 'price', title: 'Prix de vente', type: 'number' },
                { name: 'purchasePrice', title: 'Prix d\'achat', type: 'number' },
                { name: 'stock', title: 'Stock disponible', type: 'number' },
              ]
            }]
          }
        ]
      }]
    }),

    // --- LE CROSS-SELL (VENTE CROISÉE) MODIFIÉ EN ARRAY ---
    defineField({
      name: 'crossSell',
      title: 'Produits Complémentaires (Pack d\'Accessoires)',
      description: 'Sélectonnez un ou plusieurs accessoires (Coque, Vitre, Chargeur). Ils s\'afficheront sous forme de pack à ajouter au panier.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      group: 'inventory',
    }),

    // --- VISUELS & CONTENU ---
    defineField({ 
      name: 'mainImage', 
      title: 'Image Principale', 
      type: 'image', 
      group: 'content', 
      options: { hotspot: true }, 
      fields: [
        { name: 'alt', title: 'Texte Alternatif (SEO)', type: 'string', description: 'Important pour Google Images' }
      ],
      validation: (Rule) => Rule.required() 
    }),
    defineField({ name: 'images', title: 'Galerie Photos', type: 'array', group: 'content', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'colorAssoc', title: 'Couleur associée', type: 'string' }, { name: 'alt', title: 'Texte Alternatif (SEO)', type: 'string' }] }] }),
    defineField({ name: 'shortDescription', title: 'Texte d\'accroche (Italique)', type: 'text', rows: 2, group: 'content' }),
    
    defineField({
      name: 'specifications',
      title: 'Spécifications techniques',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label (ex: Taille écran)', type: 'string' },
          { name: 'value', title: 'Valeur (ex: 6.2 pouces)', type: 'string' }
        ]
      }]
    }),

    defineField({
      name: 'productFeatures',
      title: 'Arguments de vente (Réassurance sous le prix)',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { 
            name: 'iconImage', 
            title: 'Image/Logo', 
            type: 'image',
            description: 'Optionnel : Uploadez un logo ou une image (SVG ou PNG transparent recommandé).',
            options: { hotspot: true }
          },
          { 
            name: 'icon', 
            title: 'Icône Texte (Emoji)', 
            type: 'string',
            description: 'Utilisé si aucune image n\'est fournie (Ex: 🛡️).'
          },
          { name: 'text', title: 'Texte de l\'argument', type: 'string' }
        ],
        preview: {
          select: { title: 'text', media: 'iconImage' },
          prepare(selection) { return { title: selection.title, media: selection.media } }
        }
      }]
    }),

    defineField({ name: 'content', title: 'Description détaillée', type: 'array', group: 'content', of: [{ type: 'block' }] }),
    defineField({ name: 'faq', title: 'FAQ Produit', type: 'array', of: [{ type: 'object', fields: [{ name: 'question', title: 'Question', type: 'string' }, { name: 'answer', title: 'Réponse', type: 'text' }] }] }),
    defineField({ name: 'relatedProducts', title: 'Produits Associés', type: 'array', group: 'content', validation: (Rule) => Rule.max(4), of: [{ type: 'reference', to: [{ type: 'product' }] }] }),
  ],
  preview: { select: { title: 'name', media: 'mainImage' } }
})