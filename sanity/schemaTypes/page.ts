import { BasketIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Commandes',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({ name: 'orderNumber', title: 'N° Commande', type: 'string', readOnly: true }),
    defineField({ name: 'clerkId', title: 'ID Client (Clerk)', type: 'string' }),
    defineField({ name: 'isPaid', title: 'Paiement Confirmé', type: 'boolean', initialValue: false }),
    defineField({
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
    }),
    defineField({
      name: 'customer',
      title: 'Informations Client',
      type: 'object',
      fields: [
        { name: 'name', title: 'Nom Complet', type: 'string' },
        { name: 'email', title: 'E-mail', type: 'string' },
        { name: 'phone', title: 'Téléphone', type: 'string' },
        { name: 'address', title: 'Adresse de livraison', type: 'text' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Articles commandés',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', title: 'Produit', type: 'string' },
            { name: 'image', title: 'Image du produit', type: 'image' },
            { name: 'imei', title: 'Numéro IMEI', type: 'string', description: 'Obligatoire pour le suivi technique.' },
            { 
              name: 'vatType', 
              title: 'Régime TVA', 
              type: 'string',
              options: { 
                list: [
                  { title: 'Standard (20%)', value: 'standard' }, 
                  { title: 'Marge (0% - Occasion)', value: 'margin' }
                ] 
              },
              initialValue: 'standard'
            },
            { name: 'price', title: 'Prix Unitaire (€)', type: 'number' },
            { name: 'quantity', title: 'Quantité', type: 'number' },
            { name: 'color', title: 'Couleur', type: 'string' },
            { name: 'storage', title: 'Capacité', type: 'string' },
            { name: 'condition', title: 'État / Grade', type: 'string' }, // Ton ajout est ici, bien intégré
          ],
        },
      ],
    }),
    defineField({ name: 'totalAmount', title: 'Montant Total TTC (€)', type: 'number' }),
    defineField({ name: 'shippingName', title: 'Transporteur', type: 'string' }),
    defineField({ name: 'trackingNumber', title: 'Numéro de Suivi', type: 'string' }),
    defineField({
      name: 'orderDate',
      title: 'Date de commande',
      type: 'datetime',
      initialValue: () => (new Date()).toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'customer.name',
      amount: 'totalAmount',
      paid: 'isPaid',
      orderId: 'orderNumber',
      status: 'status'
    },
    prepare({ title, amount, paid, orderId, status }: any) {
      const statusIcons: Record<string, string> = {
        pending: '⏳',
        processing: '📦',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌'
      };

      return {
        title: `${paid ? '✅' : '❌'} ${title || 'Client'} — ${amount || 0}€`,
        subtitle: `${orderId || 'Brouillon'} | ${statusIcons[status] || '📦'} ${status?.toUpperCase() || 'PENDING'}`,
      }
    }
  }
})