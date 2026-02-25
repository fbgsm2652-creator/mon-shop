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
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
    }),

    // --- MEGA MENU ---
    defineField({
      name: 'icon',
      title: 'Icône de la GRANDE barre noire',
      type: 'string',
      description: 'Nom de l\'icône Lucide (ex: Smartphone, Wrench).',
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
            { name: 'icon', title: 'Icône de la colonne (ex: Apple, Smartphone)', type: 'string' }, // 🔥 NOUVEAU POUR LA 2EME BARRE
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

    // ... (Le reste de tes champs : heroSubtitle, engagementTitle, features, faq, ctaText restent inchangés) ...
    defineField({ name: 'heroSubtitle', title: 'Texte sous le H1', type: 'text', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'engagementTitle', title: 'Titre de la section Engagement', type: 'string', initialValue: 'L\'Engagement', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'features', title: 'Logos de Réassurance', type: 'array', hidden: ({ document }) => !document?.isFinal, of: [{ type: 'object', fields: [{ name: 'title', title: 'Texte', type: 'string' }, { name: 'icon', title: 'Icône', type: 'image' }] }] }),
    defineField({ name: 'content', title: 'Texte Détaillé', type: 'array', of: [{ type: 'block' }, { type: 'image' }], hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'faqTitle', title: 'Titre FAQ', type: 'string', initialValue: 'Tout savoir', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'faq', title: 'FAQ', type: 'array', hidden: ({ document }) => !document?.isFinal, of: [{ type: 'object', fields: [{ name: 'question', type: 'string' }, { name: 'answer', type: 'text' }] }] }),
    defineField({ name: 'ctaText', title: 'Texte Bouton', type: 'string', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'ctaLink', title: 'Lien Bouton', type: 'string', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', hidden: ({ document }) => !document?.isFinal }),
    defineField({ name: 'heroImage', title: 'Image en-tête', type: 'image', options: { hotspot: true }, hidden: ({ document }) => !document?.isFinal }),
  ],
})