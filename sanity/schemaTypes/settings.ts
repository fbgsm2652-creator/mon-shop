import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Paramètres Généraux',
  type: 'document',
  icon: CogIcon,
  // Empêche la création de plusieurs documents "Settings"
  // @ts-ignore
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'general', title: 'Identité & SEO' },
    { name: 'legal', title: 'Infos Facturation' },
    { name: 'zen', title: 'Paiement ZEN' },
  ],
  fields: [
    // --- GROUPE IDENTITÉ & SEO ---
    defineField({
      name: 'companyName',
      title: 'Nom de l\'entreprise',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'baseUrl',
      title: 'URL officielle du site',
      type: 'url',
      group: 'general',
      description: 'Ex: https://renw.fr',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'general',
      description: 'L\'icône de l\'onglet navigateur.',
    }),
    defineField({
      name: 'globalSeo',
      title: 'SEO Global (Fallback)',
      type: 'object',
      group: 'general',
      fields: [
        { name: 'metaTitle', title: 'Titre Meta par défaut', type: 'string' },
        { name: 'metaDescription', title: 'Description Meta par défaut', type: 'text', rows: 3 },
      ]
    }),

    // --- GROUPE INFOS LÉGALES (Pour tes factures PDF) ---
    defineField({
      name: 'address',
      title: 'Adresse du siège social',
      type: 'text',
      group: 'legal',
      rows: 2,
      description: 'Cette adresse apparaîtra sur vos factures.',
    }),
    defineField({
      name: 'siret',
      title: 'Numéro SIRET',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'invoiceLogo',
      title: 'Logo Facture',
      type: 'image',
      group: 'legal',
      description: 'Logo haute qualité pour les PDFs de facturation.',
    }),

    // --- GROUPE PAIEMENT ZEN ---
    defineField({
      name: 'zenTerminalId',
      title: 'ZEN Terminal ID',
      type: 'string',
      group: 'zen',
    }),
    defineField({
      name: 'zenSecretKey',
      title: 'ZEN Secret Key',
      type: 'string',
      group: 'zen',
    }),
    defineField({
      name: 'zenMode',
      title: 'Mode de l\'API',
      type: 'string',
      group: 'zen',
      options: {
        list: [
          { title: 'Production (Live)', value: 'https://api.zen.com/v1/transactions' },
          { title: 'Sandbox (Test)', value: 'https://sandbox.zen.com/v1/transactions' }
        ],
        layout: 'radio'
      },
      initialValue: 'https://sandbox.zen.com/v1/transactions'
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuration Globale RENW' }
    }
  }
})