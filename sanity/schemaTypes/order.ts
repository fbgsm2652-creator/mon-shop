import { BasketIcon } from '@sanity/icons'

export default {
  name: 'order',
  title: 'Commandes',
  type: 'document',
  icon: BasketIcon,
  fields: [
    { name: 'orderNumber', title: 'N° Commande', type: 'string', readOnly: true },
    { name: 'clerkId', title: 'ID Client (Clerk)', type: 'string' },
    { name: 'isPaid', title: 'Paiement Confirmé', type: 'boolean', initialValue: false },
    {
      name: 'status',
      title: 'État de la commande',
      type: 'string',
      options: {
        list: [
          { title: '⏳ En attente', value: 'pending' },
          { title: '📦 En préparation', value: 'processing' },
          { title: '🚚 Expédié', value: 'shipped' },
          { title: '✅ Livré', value: 'delivered' },
          { title: '❌ Annulé', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'customer',
      title: 'Informations Client',
      type: 'object',
      fields: [
        { name: 'name', title: 'Nom Complet', type: 'string' },
        { name: 'email', title: 'E-mail', type: 'string' },
        { name: 'phone', title: 'Téléphone', type: 'string' },
        { name: 'address', title: 'Adresse de livraison', type: 'text' },
      ],
    },
    {
      name: 'items',
      title: 'Articles commandés',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', title: 'Produit', type: 'string' },
            { name: 'image', title: 'Image du produit', type: 'image', options: { hotspot: true } },
            { name: 'imei', title: 'Numéro IMEI', type: 'string' },
            { 
              name: 'vatType', 
              title: 'Régime TVA', 
              type: 'string',
              options: { 
                list: [
                  { title: 'Standard (20%)', value: 'standard' }, 
                  { title: 'Marge (0% - Occasion)', value: 'margin' }
                ] 
              }
            },
            { name: 'price', title: 'Prix Unitaire', type: 'number' },
            { name: 'quantity', title: 'Quantité', type: 'number' },
            { name: 'color', title: 'Couleur', type: 'string' },
            { name: 'storage', title: 'Capacité', type: 'string' },
            { name: 'condition', title: 'État / Grade', type: 'string' },
          ],
        },
      ],
    },
    { name: 'totalAmount', title: 'Montant Total TTC', type: 'number' },
    
    // --- NOUVEAU : POUR LE CALCUL DES MARGES DANS LE DASHBOARD ---
    { 
      name: 'totalCostPrice', 
      title: 'Prix d\'achat Total (Coût)', 
      type: 'number',
      description: 'Somme des prix d\'achat pour calculer la marge brute.'
    },

    { name: 'shippingName', title: 'Transporteur (Mode d\'envoi)', type: 'string' }, 
    { name: 'trackingNumber', title: 'Numéro de Suivi', type: 'string' },
    { name: 'orderDate', title: 'Date de commande', type: 'datetime' },

    // --- NOUVEAU : CHAMPS POUR L'API TRANSPORT (DORMANT) ---
    {
      name: 'shippingMode',
      title: 'Mode d\'expédition',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          { title: 'Manuel (Saisie)', value: 'manual' },
          { title: 'Automatique (API)', value: 'api' }
        ],
        layout: 'radio'
      }
    },
    {
      name: 'apiLabelUrl',
      title: 'URL Étiquette API (PDF)',
      type: 'url',
      description: 'Lien vers l\'étiquette générée par l\'API transporteur.'
    },
    {
      name: 'apiLog',
      title: 'Log API Transporteur',
      type: 'text',
      readOnly: true,
      description: 'Historique des échanges avec l\'API.'
    }
  ],
  preview: {
    select: { 
      title: 'customer.name', 
      amount: 'totalAmount', 
      orderId: 'orderNumber', 
      status: 'status', 
      paid: 'isPaid' 
    },
    prepare({ title, amount, orderId, status, paid }: any) {
      const statusIcons: Record<string, string> = {
        pending: '⏳',
        processing: '📦',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌'
      };

      return {
        title: `${paid ? '✅' : '❌'} ${title || 'Client'} — ${amount || 0}€`,
        subtitle: `${orderId || 'Brouillon'} | ${statusIcons[status] || '📦'} ${status?.toUpperCase() || 'PENDING'}`
      }
    }
  }
}