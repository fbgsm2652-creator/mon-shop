import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const category = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: Tag,
  // 🗂️ CRÉATION DES GROUPES (FIELDSETS) POUR ORGANISER LE BO
  fieldsets: [
    { name: 'general', title: '1. Informations Générales' },
    { name: 'megamenu', title: '2. Configuration du Mega Menu', options: { collapsible: true, collapsed: false } },
    { name: 'content', title: '3. Contenu de la Page (Textes & Réassurance)', options: { collapsible: true, collapsed: false } },
    { name: 'faqSection', title: '4. Section FAQ', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: '5. Configuration SEO (Google & Meta)', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // ==========================================
    // 1. INFORMATIONS GÉNÉRALES
    // ==========================================
    defineField({
      name: 'title',
      title: 'Nom court (Menu & URL) - ex: iPhone X',
      type: 'string',
      fieldset: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      fieldset: 'general',
      options: { source: 'title' },
    }),
    defineField({
      name: 'isFinal',
      title: 'Est-ce une catégorie finale ? (Page produit)',
      type: 'boolean',
      fieldset: 'general',
      initialValue: false,
    }),
    defineField({
      name: 'isParent',
      title: 'Afficher dans la barre de menu haut ?',
      type: 'boolean',
      fieldset: 'general',
      initialValue: false,
      hidden: ({ document }) => document?.isFinal === true,
    }),

    // ==========================================
    // 2. MEGA MENU (Caché si catégorie finale)
    // ==========================================
    defineField({
      name: 'menuPosition',
      title: 'Position dans le menu',
      type: 'number',
      fieldset: 'megamenu',
      description: 'Ordre d\'affichage (1 = en premier, 2 = en deuxième...).',
      initialValue: 99,
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'icon',
      title: 'Icône de la GRANDE barre noire',
      type: 'string',
      fieldset: 'megamenu',
      description: 'Nom de l\'icône Lucide ou nom de la marque (ex: Apple, Samsung, Smartphone, Wrench).',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'menuImage',
      title: 'Image à GAUCHE du Mega Menu',
      type: 'image',
      fieldset: 'megamenu',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'subCategories',
      title: 'Colonnes du Mega Menu (La 2ème barre grise)',
      type: 'array',
      fieldset: 'megamenu',
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
    // 3. CONTENU (Caché si parent)
    // ==========================================
    defineField({
      name: 'h1Title',
      title: 'Gros Titre de la page (H1 SEO)',
      type: 'string',
      fieldset: 'content',
      description: 'Ex: Pièces Détachées iPhone X (A1865, A1901). Laissez vide pour utiliser le nom court.',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Texte sous le H1 (Introduction)',
      type: 'text',
      fieldset: 'content',
      description: 'Le texte gris et classe qui s’affiche juste sous le gros titre H1.',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'engagementTitle',
      title: 'Titre de la section Engagement',
      type: 'string',
      fieldset: 'content',
      description: 'Ex: "L\'Engagement" (Le mot "RENW." s\'ajoute automatiquement en bleu sur le site)',
      initialValue: 'L\'Engagement',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'features',
      title: 'Logos de Réassurance',
      type: 'array',
      fieldset: 'content',
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
      fieldset: 'content',
      description: 'Le texte d\'autorité pour Google. Utilisez le menu déroulant pour créer des balises H2 et H3.',
      of: [{ type: 'block' }, { type: 'image' }],
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte du Bouton (Bas de page)',
      type: 'string',
      fieldset: 'content',
      initialValue: 'En savoir plus sur nos méthodes',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien du bouton',
      type: 'string',
      fieldset: 'content',
      description: 'Tapez simplement l\'URL de la page (ex: /a-propos ou /concept)',
      hidden: ({ document }) => !document?.isFinal,
    }),

    // ==========================================
    // 4. FAQ (Caché si parent)
    // ==========================================
    defineField({
      name: 'faqTitle',
      title: 'Titre de la section FAQ',
      type: 'string',
      fieldset: 'faqSection',
      initialValue: 'Questions Fréquentes',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'faq',
      title: 'Questions & Réponses',
      type: 'array',
      fieldset: 'faqSection',
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
    // 5. SEO & META (Caché si parent)
    // ==========================================
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (Titre Google)',
      type: 'string',
      fieldset: 'seo',
      description: 'Titre affiché dans les résultats de recherche (Max 60 caractères).',
      hidden: ({ document }) => !document?.isFinal,
      validation: (Rule) => Rule.max(60).warning('Le titre devrait faire moins de 60 caractères pour ne pas être tronqué sur Google.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (Texte Google)',
      type: 'text',
      fieldset: 'seo',
      description: 'Le petit texte descriptif affiché sous le lien dans Google (Max 150-160 caractères).',
      hidden: ({ document }) => !document?.isFinal,
      validation: (Rule) => Rule.max(160).warning('La description devrait faire moins de 160 caractères pour ne pas être tronquée.'),
    }),
    // 🔥 NOUVEAU CHAMP : META KEYWORDS 🔥
    defineField({
      name: 'metaKeywords',
      title: 'Mots-clés (Meta Keywords)',
      type: 'array',
      fieldset: 'seo',
      description: 'Mots-clés séparés par "Entrée". Utile pour certains moteurs de recherche et pour votre propre suivi.',
      hidden: ({ document }) => !document?.isFinal,
      of: [{ type: 'string' }],
      options: {
        layout: 'tags' // Permet d'afficher les mots comme des "étiquettes" visuelles très pratiques dans Sanity
      }
    }),
    defineField({
      name: 'heroImage',
      title: 'Image de partage (Réseaux sociaux / Optionnel)',
      type: 'image',
      fieldset: 'seo',
      options: { hotspot: true },
      hidden: ({ document }) => !document?.isFinal,
    }),
  ],
})