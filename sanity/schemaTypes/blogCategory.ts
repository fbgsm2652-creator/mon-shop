import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogCategory', // C'est l'ID exact que ton code de blog recherche
  title: 'Catégories du Mag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la thématique',
      type: 'string',
      description: 'Ex: Astuces iPhone, Actualités Tech, Guides Réparation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL de la catégorie',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description SEO (apparaît en haut de page)',
      type: 'text',
      rows: 3,
      description: 'Expliquez ce que l\'utilisateur trouvera ici. Important pour le référencement.',
    }),
  ],
})