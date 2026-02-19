import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shippingMethod',
  title: 'Modes de Livraison',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({ 
      name: 'name', 
      title: 'Nom du transporteur', 
      type: 'string',
      description: 'Ex: Colissimo, Chronopost, Mondial Relay',
      validation: (Rule) => Rule.required()
    }),
    defineField({ 
      name: 'logo', 
      title: 'Logo du transporteur', 
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({ 
      name: 'price', 
      title: 'Frais de port standard (€)', 
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({ 
      name: 'freeFrom', 
      title: 'Livraison offerte à partir de (€)', 
      type: 'number',
      description: 'Laissez vide si jamais offerte.'
    }),
    defineField({ 
      name: 'estimatedTime', 
      title: 'Délai de livraison estimé', 
      type: 'string',
      description: 'Ex: 24/48h ou 3 à 5 jours ouvrés'
    }),
    defineField({
      name: 'zones',
      title: 'Zones de livraison desservies',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🇫🇷 France Métropolitaine', value: 'FR' },
          { title: '🇧🇪 Belgique', value: 'BE' },
          { title: '🇨🇭 Suisse', value: 'CH' },
          { title: '🌍 DOM (Martinique, Guyane, etc.)', value: 'DOM' },
          { title: '🇪🇺 Europe (Autres)', value: 'EU' },
        ]
      },
      validation: (Rule) => Rule.required().min(1).error('Sélectionnez au moins une zone.')
    }),
    defineField({
      name: 'isActive',
      title: 'Activer ce mode de livraison',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'logo'
    },
    prepare({ title, price, media }) {
      return {
        title: title || 'Nouveau transporteur',
        subtitle: price === 0 ? 'Gratuit' : `${price} €`,
        media
      }
    }
  }
})