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
      title: 'Nom de la catégorie',
      type: 'string',
      description: 'Ex: iPhone 15 Pro ou Pièces détachées',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFinal',
      title: 'Est-ce une catégorie finale ?',
      type: 'boolean',
      initialValue: false,
      description: 'Activez pour les modèles qui ont leur propre page de vente (ex: iPhone 13).',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      hidden: ({ document }) => !document?.isFinal,
      validation: (Rule) => Rule.custom((slug, context) => {
        if (context.document?.isFinal && !slug) return 'L’URL est obligatoire pour une catégorie finale.'
        return true
      }),
    }),
    defineField({
      name: 'parent',
      title: 'Catégorie Parente',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Pour organiser la hiérarchie (ex: iPhone 15 Pro appartient à iPhone).',
    }),
    
    // --- VISUELS ---
    defineField({
      name: 'menuImage',
      title: 'Image du Méga Menu',
      type: 'image',
      description: 'Format vignette pour la navigation.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Image d’en-tête (Page)',
      type: 'image',
      description: 'Grande image affichée en haut de la page catégorie.',
      hidden: ({ document }) => !document?.isFinal,
      options: { hotspot: true },
    }),

    // --- ARMURE SEO (INDISPENSABLE POUR GOOGLE) ---
    defineField({
      name: 'description',
      title: 'Contenu Marketing (SEO)',
      type: 'array',
      description: 'Texte riche pour présenter le modèle et booster le référencement.',
      of: [{ type: 'block' }],
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Le titre bleu qui apparaît dans Google (Idéal: 50-60 caractères).',
      hidden: ({ document }) => !document?.isFinal,
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Le texte sous le titre dans Google (Idéal: 150 caractères).',
      hidden: ({ document }) => !document?.isFinal,
    }),
    
    // --- FAQ (STRUCTURED DATA) ---
    defineField({
      name: 'faq',
      title: 'Questions Fréquentes (FAQ)',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parent.title',
      media: 'menuImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `Sous : ${subtitle}` : 'Catégorie Racine',
        media,
      }
    },
  },
})