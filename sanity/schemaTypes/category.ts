import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const category = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la catégorie (H1)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFinal',
      title: 'Est-ce une catégorie finale ?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isParent',
      title: 'Afficher dans la barre de menu haut ?',
      type: 'boolean',
      initialValue: false,
      hidden: ({ document }) => document?.isFinal === true,
    }),
    // 🔥 NOUVEAU CHAMP : Pour gérer l'ordre d'affichage dans la barre noire
    defineField({
      name: 'menuPosition',
      title: 'Position dans le menu',
      type: 'number',
      description: 'Ordre d\'affichage (1 = en premier, 2 = en deuxième...).',
      initialValue: 99,
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
    }),

    // --- MEGA MENU (Caché si c'est une page finale) ---
    defineField({
      name: 'icon',
      title: 'Icône de la GRANDE barre noire',
      type: 'string',
      description: 'Nom de l\'icône Lucide ou nom de la marque (ex: Apple, Samsung, Smartphone, Wrench).',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'menuImage',
      title: 'Image à GAUCHE du Mega Menu',
      type: 'image',
      hidden: ({ document }) => !document?.isParent,
    }),
    defineField({
      name: 'subCategories',
      title: 'Colonnes du Mega Menu (La 2ème barre grise)',
      type: 'array',
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

    // --- PERSONNALISATION (Caché si c'est un parent de menu) ---
    defineField({
      name: 'heroSubtitle',
      title: 'Texte sous le H1',
      type: 'text',
      description: 'Le texte gris et classe qui s’affiche juste sous le gros titre H1.',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'engagementTitle',
      title: 'Titre de la section Engagement',
      type: 'string',
      description: 'Ex: "L\'Engagement" (Le mot "RENW." s\'ajoute automatiquement en bleu sur le site)',
      initialValue: 'L\'Engagement',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'features',
      title: 'Logos de Réassurance',
      type: 'array',
      description: 'Ajoutez les petits logos spécifiques à cette catégorie',
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
      title: 'Texte de la Vignette (Description détaillée)',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
      hidden: ({ document }) => !document?.isFinal,
    }),

    // --- FAQ ---
    defineField({
      name: 'faqTitle',
      title: 'Titre de la section FAQ',
      type: 'string',
      initialValue: 'Tout savoir sur nos modèles',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'faq',
      title: 'Questions Fréquentes',
      type: 'array',
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

    // --- BOUTON DU BAS ---
    defineField({
      name: 'ctaText',
      title: 'Texte du Bouton (Bas de page)',
      type: 'string',
      initialValue: 'En savoir plus sur nos méthodes',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien du bouton',
      type: 'string',
      description: 'Tapez simplement l\'URL de la page (ex: /a-propos ou /concept)',
      hidden: ({ document }) => !document?.isFinal,
    }),

    // --- SEO ---
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (Titre Google)',
      type: 'string',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (Texte Google)',
      type: 'text',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'heroImage',
      title: 'Image d’en-tête (Si besoin)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => !document?.isFinal,
    }),
  ],
})