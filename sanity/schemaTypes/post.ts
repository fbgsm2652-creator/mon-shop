import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Articles du Mag',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Contenu' },
    { name: 'seo', title: 'SEO & Meta' },
    { name: 'commerce', title: 'Conversion' },
  ],
  fields: [
    // --- IDENTITÉ ---
    defineField({
      name: 'title',
      title: 'Titre de l\'article (H1)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL de l\'article',
      type: 'slug',
      group: 'seo',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blogCategory',
      title: 'Catégorie du Mag',
      type: 'reference',
      group: 'content',
      to: [{ type: 'blogCategory' }],
      validation: (Rule) => Rule.required(),
    }),

    // --- VISUEL ---
    defineField({
      name: 'mainImage',
      title: 'Image à la une',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        { 
          name: 'alt', 
          title: 'Texte alternatif (SEO)', 
          type: 'string',
          validation: (Rule) => Rule.required().error('Le texte ALT est indispensable pour Google Images.'),
        }
      ],
    }),

    // --- CONTENU RICHE ---
    defineField({
      name: 'content',
      title: 'Corps de l\'article',
      type: 'array',
      group: 'content',
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Paragraphe', value: 'normal'},
            {title: 'Titre H2', value: 'h2'},
            {title: 'Titre H3', value: 'h3'},
            {title: 'Citation', value: 'blockquote'},
          ],
        }, 
        { 
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Description image', type: 'string' }]
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Bloc de Code / Tuto',
          fields: [
            { name: 'language', title: 'Langage', type: 'string', initialValue: 'bash' },
            { name: 'code', title: 'Code', type: 'text' }
          ]
        }
      ],
    }),

    // --- SEO META ---
    defineField({
      name: 'excerpt',
      title: 'Résumé Meta Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Google tronque après 160 caractères.'),
    }),

    // --- CONVERSION & E-E-A-T ---
    defineField({
      name: 'author',
      title: 'Auteur / Expert',
      type: 'string',
      group: 'content',
      initialValue: 'L\'équipe RENW',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Produits recommandés',
      type: 'array',
      group: 'commerce',
      description: 'Lier des iPhones ou pièces pour générer des ventes.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),

    // --- STATUT ---
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'seo',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Mettre à la une',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
      cat: 'blogCategory.title'
    },
    prepare({title, author, media, cat}) {
      return {
        title,
        subtitle: `${cat || 'Mag'} | Par ${author || 'RENW'}`,
        media
      }
    },
  },
})