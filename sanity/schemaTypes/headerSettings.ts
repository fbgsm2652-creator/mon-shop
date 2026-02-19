import { ControlsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'headerSettings',
  title: 'Configuration Header',
  type: 'document',
  icon: ControlsIcon,
  // Sécurité : Un seul Header possible pour éviter les conflits
  // @ts-ignore
  __experimental_actions: ['update', 'publish'], 
  fields: [
    defineField({
      name: 'isPromoActive',
      title: 'Activer la barre de promotion',
      type: 'boolean',
      initialValue: false,
      description: 'Affiche ou masque le bandeau tout en haut du site.',
    }),
    defineField({
      name: 'promoMessage',
      title: 'Message de la barre Promo',
      type: 'string',
      hidden: ({ document }) => !document?.isPromoActive,
      description: 'Ex: Livraison offerte dès 100€ d’achat.',
    }),
    
    // --- LOGO & IDENTITÉ ---
    defineField({
      name: 'logoImage',
      title: 'Logo Officiel',
      type: 'image',
      options: { hotspot: true },
      description: 'Format recommandé : PNG transparent ou SVG.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoAlt',
      title: 'Texte alternatif (SEO)',
      type: 'string',
      description: 'Décrivez l’image (ex: Logo RENW France). Crucial pour Google.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoWidth',
      title: 'Largeur du Logo (px)',
      type: 'number',
      initialValue: 120,
      description: 'Ajustez la taille pour un rendu parfait sur desktop.',
    }),

    // --- NAVIGATION ---
    defineField({
      name: 'magLinkText',
      title: 'Texte du bouton "Magazine"',
      type: 'string',
      initialValue: 'Le Mag',
      description: 'Le nom du lien vers votre blog ou actualités.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuration du Header Actif',
      }
    }
  }
})