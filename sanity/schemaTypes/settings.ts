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
    { name: 'contact', title: 'Page Contact' }, // 👈 NOUVEL ONGLET AJOUTÉ ICI
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
      name: 'shortName',
      title: 'Nom court (Pour App Mobile)',
      type: 'string',
      group: 'general',
      description: 'Le nom qui s\'affiche sous l\'icône sur le téléphone (ex: RENW)',
      initialValue: 'RENW',
    }),
    defineField({
      name: 'themeColor',
      title: 'Couleur du thème',
      type: 'string',
      group: 'general',
      description: 'Code couleur hexa pour la barre du navigateur mobile (ex: #0066CC)',
      initialValue: '#0066CC',
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
      title: 'Favicon / Icône d\'App',
      type: 'image',
      group: 'general',
      description: 'L\'icône de l\'onglet navigateur et de l\'application mobile (Format carré recommandé).',
    }),
    defineField({
      name: 'globalSeo',
      title: 'SEO Global (Fallback)',
      type: 'object',
      group: 'general',
      fields: [
        { name: 'metaTitle', title: 'Titre Meta par défaut', type: 'string' },
        { name: 'metaDescription', title: 'Description Meta par défaut', type: 'text' }
      ]
    }),

    // --- GROUPE INFOS LÉGALES (Pour tes factures PDF) ---
    defineField({
      name: 'address',
      title: 'Adresse du siège social',
      type: 'text', 
      group: 'legal',
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

    // --- 🚀 NOUVEAU : GROUPE PAGE CONTACT ---
    defineField({ 
      name: 'contactPageTitle', 
      title: 'Gros Titre de la page', 
      type: 'string', 
      group: 'contact', 
      initialValue: 'Comment pouvons-nous vous aider ?' 
    }),
    defineField({ 
      name: 'contactPageSubtitle', 
      title: 'Sous-titre explicatif', 
      type: 'text', 
      group: 'contact' 
    }),
    defineField({ 
      name: 'contactHeading', 
      title: 'Titre de la colonne gauche', 
      type: 'string', 
      group: 'contact', 
      initialValue: 'Entrons en contact.' 
    }),
    defineField({ 
      name: 'contactEmail', 
      title: 'Adresse E-mail (Affichage public)', 
      type: 'string', 
      group: 'contact' 
    }),
    defineField({ 
      name: 'contactEmailSubtext', 
      title: 'Sous-texte E-mail', 
      type: 'string', 
      group: 'contact',
      initialValue: 'Nous répondons généralement sous 24h.'
    }),
    defineField({ 
      name: 'contactPhone', 
      title: 'Numéro de téléphone', 
      type: 'string', 
      group: 'contact' 
    }),
    defineField({ 
      name: 'contactPhoneSubtext', 
      title: 'Sous-texte Téléphone', 
      type: 'string', 
      group: 'contact',
      initialValue: 'Du Lundi au Vendredi, de 9h à 18h.'
    }),
    defineField({ 
      name: 'contactAddress', 
      title: 'Adresse de contact (Affichage public)', 
      type: 'text', 
      group: 'contact',
      description: 'Peut être identique ou différente de l\'adresse de facturation.'
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuration Globale RENW' }
    }
  }
})