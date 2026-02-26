import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const category = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: Tag,
  // 🗂️ UTILISATION DES "GROUPS" POUR CRÉER DES ONGLETS HORISONTAUX
  groups: [
    { name: 'general', title: '1. Général', default: true },
    { name: 'megamenu', title: '2. Mega Menu' },
    { name: 'content', title: '3. Contenu & Textes' },
    { name: 'faqSection', title: '4. FAQ' },
    { name: 'seo', title: '5. SEO & Meta' },
  ],
  fields: [
    // ==========================================
    // 1. INFORMATIONS GÉNÉRALES
    // ==========================================
    defineField({
      name: 'title',
      title: 'Nom court (Menu & URL) - ex: iPhone X',
      type: 'string',
      group: 'general', // On assigne ce champ à l'onglet "general"
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: { source: 'title' },
    }),
    defineField({
      name: 'isFinal',
      title: 'Est-ce une catégorie finale ? (Page produit)',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),
    defineField({
      name: 'isParent',
      title: 'Afficher dans la barre de menu haut ?',
      type: 'boolean',
      group: 'general',
      initialValue: false,
      hidden: ({ document }) => document?.isFinal === true,
    }),

    // ==========================================
    // 2. MEGA MENU
    // ==========================================
    defineField({
      name: 'menuPosition',
      title: 'Position dans le menu',
      type: 'number',
      group: 'megamenu',
      description: 'Ordre d\'affichage (1 = en premier, 2 = en deuxième...).',
      initialValue: 99,
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'icon',
      title: 'Icône de la GRANDE barre noire',
      type: 'string',
      group: 'megamenu',
      description: 'Nom de l\'icône Lucide ou nom de la marque (ex: Apple, Samsung, Smartphone, Wrench).',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'menuImage',
      title: 'Image à GAUCHE du Mega Menu',
      type: 'image',
      group: 'megamenu',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'subCategories',
      title: 'Colonnes du Mega Menu (La 2ème barre grise)',
      type: 'array',
      group: 'megamenu',
      hidden: ({ document }) => !document?.isParent,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titre de la colonne (ex: Pièces Apple)', type: 'string' },
            { name: 'icon', title: 'Icône de la colonne (ex: Apple, Smartphone)', type: 'string' },
            { 
              name: 'finalModels', 
              title: 'Liens de cette colonne', 
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'category' }, { type: 'product' }] }] 
            }
          ]
        }
      ]
    }),

    // ==========================================
    // 3. CONTENU & TEXTES
    // ==========================================
    defineField({
      name: 'h1Title',
      title: 'Gros Titre de la page (H1 SEO)',
      type: 'string',
      group: 'content',
      description: 'Ex: Pièces Détachées iPhone X (A1865, A1901). Laissez vide pour utiliser le nom court.',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Texte sous le H1 (Introduction)',
      type: 'text',
      group: 'content',
      description: 'Le texte gris et classe qui s’affiche juste sous le gros titre H1.',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'engagementTitle',
      title: 'Titre de la section Engagement',
      type: 'string',
      group: 'content',
      description: 'Ex: "L\'Engagement" (Le mot "RENW." s\'ajoute automatiquement en bleu sur le site)',
      initialValue: 'L\'Engagement',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'features',
      title: 'Logos de Réassurance',
      type: 'array',
      group: 'content',
      description: 'Ajoutez les petits logos spécifiques à cette catégorie (ex: Livraison 24h, Garantie)',
      hidden: ({ document }) => !document?.isFinal,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Texte du logo', type: 'string' },
            { name: 'icon', title: 'Icône', type: 'image' },
          ],
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Texte SEO détaillé (Bas de page)',
      type: 'array',
      group: 'content',
      description: 'Le texte d\'autorité pour Google. Utilisez le menu déroulant pour créer des balises H2 et H3.',
      of: [{ type: 'block' }, { type: 'image' }],
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte du Bouton (Bas de page)',
      type: 'string',
      group: 'content',
      initialValue: 'En savoir plus sur nos méthodes',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien du bouton',
      type: 'string',
      group: 'content',
      description: 'Tapez simplement l\'URL de la page (ex: /a-propos ou /concept)',
      hidden: ({ document }) => !document?.isFinal,
    }),

    // ==========================================
    // 4. FAQ
    // ==========================================
    defineField({
      name: 'faqTitle',
      title: 'Titre de la section FAQ',
      type: 'string',
      group: 'faqSection',
      initialValue: 'Questions Fréquentes',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'faq',
      title: 'Questions & Réponses',
      type: 'array',
      group: 'faqSection',
      description: 'Génère automatiquement les Rich Snippets Google (Schema.org).',
      hidden: ({ document }) => !document?.isFinal,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Réponse', type: 'text' },
          ],
        },
      ],
    }),

    // ==========================================
    // 5. SEO & META
    // ==========================================
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (Titre Google)',
      type: 'string',
      group: 'seo',
      description: 'Titre affiché dans les résultats de recherche (Max 60 caractères).',
      hidden: ({ document }) => !document?.isFinal,
      validation: (Rule) => Rule.max(60).warning('Le titre devrait faire moins de 60 caractères pour ne pas être tronqué sur Google.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (Texte Google)',
      type: 'text',
      group: 'seo',
      description: 'Le petit texte descriptif affiché sous le lien dans Google (Max 150-160 caractères).',
      hidden: ({ document }) => !document?.isFinal,
      validation: (Rule) => Rule.max(160).warning('La description devrait faire moins de 160 caractères pour ne pas être tronquée.'),
    }),
    defineField({
      name: 'metaKeywords',
      title: 'Mots-clés (Meta Keywords)',
      type: 'array',
      group: 'seo',
      description: 'Tapez un mot-clé et appuyez sur Entrée.',
      hidden: ({ document }) => !document?.isFinal,
      of: [{ type: 'string' }],
      options: {
        layout: 'tags' // L'affichage visuel en bulles
      }
    }),
    defineField({
      name: 'heroImage',
      title: 'Image de partage (Réseaux sociaux / Optionnel)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      hidden: ({ document }) => !document?.isFinal,
    }),
  ],
})