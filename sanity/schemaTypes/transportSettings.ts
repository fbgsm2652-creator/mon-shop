import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'transportSettings',
  title: 'Configuration API Transport',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'isApiActive',
      title: 'Activer les APIs de transport',
      type: 'boolean',
      initialValue: false,
      description: 'Basculez sur ON pour activer l\'automatisation des étiquettes.',
    }),

    // --- MONDIAL RELAY ---
    defineField({
      name: 'mondialRelay',
      title: 'Mondial Relay API',
      type: 'object',
      fields: [
        { name: 'enseigne', type: 'string', title: 'Code Enseigne' },
        { name: 'apiKey', type: 'string', title: 'Clé Privée' },
      ],
    }),

    // --- COLISSIMO ---
    defineField({
      name: 'colissimo',
      title: 'Colissimo API',
      type: 'object',
      fields: [
        { name: 'contractNumber', type: 'string', title: 'Numéro de Contrat' },
        { name: 'password', type: 'string', title: 'Mot de passe API' },
      ],
    }),

    // --- CHRONOPOST ---
    defineField({
      name: 'chronopost',
      title: 'Chronopost API',
      type: 'object',
      fields: [
        { name: 'accountNumber', type: 'string', title: 'N° de compte' },
        { name: 'password', type: 'string', title: 'Mot de passe' },
        { name: 'subAccount', type: 'string', title: 'Code sous-compte (Optionnel)' },
      ],
    }),

    // --- DHL EXPRESS ---
    defineField({
      name: 'dhl',
      title: 'DHL Express API',
      type: 'object',
      fields: [
        { name: 'siteId', type: 'string', title: 'Site ID' },
        { name: 'password', type: 'string', title: 'Mot de passe' },
        { name: 'accountNumber', type: 'string', title: 'N° de compte DHL' },
      ],
    }),

    // --- UPS ---
    defineField({
      name: 'ups',
      title: 'UPS API',
      type: 'object',
      fields: [
        { name: 'accessKey', type: 'string', title: 'Access Key' },
        { name: 'username', type: 'string', title: 'Username' },
        { name: 'password', type: 'string', title: 'Password' },
        { name: 'accountNumber', type: 'string', title: 'N° de compte UPS' },
      ],
    }),

    // --- BOXTAL (Multi-transporteurs) ---
    defineField({
      name: 'boxtal',
      title: 'Boxtal API',
      type: 'object',
      fields: [
        { name: 'apiKey', type: 'string', title: 'API Key' },
        { name: 'apiSecret', type: 'string', title: 'API Secret' },
      ],
    }),
  ],
})