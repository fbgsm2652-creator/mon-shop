import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'infoPage',
  title: 'Pages Informatives', // Le nom dans le menu Sanity
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page (ex: Qui sommes-nous ?)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL de la page (ex: qui-sommes-nous)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO pour Google)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Contenu de la page',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})