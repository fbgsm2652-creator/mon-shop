import { ComponentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footerSettings',
  title: 'Configuration du Footer',
  type: 'document',
  icon: ComponentIcon,
  
  // 👇 VOICI LA CORRECTION 👇
  // J'ai commenté ces deux lignes. Cela va faire réapparaître le bouton "Créer" dans Sanity.
  // @ts-ignore
  // __experimental_actions: ['update', 'publish'], 
  
  fields: [
    defineField({
      name: 'logoImage',
      title: 'Image du Logo',
      type: 'image',
      description: 'Format PNG ou SVG conseillé.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoText',
      title: 'Nom de la marque',
      type: 'string',
      description: 'Ex: RENW',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vision',
      title: 'Texte de Vision / Description',
      type: 'text',
      rows: 3,
      description: 'Slogan ou mission affiché sous le logo.',
    }),
    defineField({
      name: 'address',
      title: 'Coordonnées du Siège',
      type: 'text',
      rows: 2,
      description: 'Adresse physique complète pour la réassurance client.',
    }),
    defineField({
      name: 'sections',
      title: 'Colonnes de Liens',
      description: 'Configurez les 3 colonnes du menu (Catalogue, Aide, Légal).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            { name: 'title', title: 'Titre de la colonne', type: 'string', validation: (Rule) => Rule.required() },
            {
              name: 'links',
              title: 'Liste des liens',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Texte du lien', type: 'string', validation: (Rule) => Rule.required() },
                    { name: 'url', title: 'URL de destination', type: 'string', validation: (Rule) => Rule.required() }
                  ]
                }
              ]
            }
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) { return { title: `Colonne: ${title}` } }
          }
        }
      ],
      validation: (Rule) => Rule.max(3).error('Le design RENW supporte maximum 3 colonnes.'),
    }),
    
    // --- LOCALISATION (BADGE PULSANT) ---
    defineField({
      name: 'locationCity',
      title: 'Ville (Badge Bas de page)',
      type: 'string',
      initialValue: 'Jijel',
      group: 'location'
    }),
    defineField({
      name: 'locationCountry',
      title: 'Pays (Badge Bas de page)',
      type: 'string',
      initialValue: 'Algérie',
      group: 'location'
    })
  ],
  groups: [
    { name: 'location', title: 'Localisation' }
  ],
  preview: {
    select: { title: 'logoText' },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ? `Footer Actif : ${title}` : 'Configuration du Footer',
      }
    }
  }
})