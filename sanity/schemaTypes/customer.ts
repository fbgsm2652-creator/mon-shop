import { User } from 'lucide-react'

export default {
  name: 'customer',
  title: 'Clients',
  type: 'document',
  icon: User,
  fields: [
    { 
      name: 'clerkId', 
      title: 'Clerk ID', 
      type: 'string',
      description: 'Identifiant unique de l’utilisateur (Auth)',
      readOnly: true // On ne modifie pas l'ID à la main
    },
    { 
      name: 'firstName', 
      title: 'Prénom', 
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    { 
      name: 'lastName', 
      title: 'Nom', 
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    { 
      name: 'email', 
      title: 'Email', 
      type: 'string',
      validation: (Rule: any) => Rule.required().email()
    },
    { 
      name: 'phone', 
      title: 'Téléphone', 
      type: 'string',
      description: 'Indispensable pour le suivi de livraison.'
    },
    {
      name: 'addresses',
      title: 'Adresses enregistrées',
      type: 'array',
      of: [{
        type: 'object',
        name: 'address',
        fields: [
          { name: 'street', title: 'Rue / Immeuble', type: 'string' },
          { name: 'city', title: 'Ville', type: 'string' },
          { name: 'zipCode', title: 'Code Postal', type: 'string' },
          { 
            name: 'country', 
            title: 'Pays', 
            type: 'string', 
            initialValue: 'France' 
          },
          { name: 'isDefault', title: 'Adresse par défaut', type: 'boolean', initialValue: false }
        ],
        preview: {
          select: {
            title: 'street',
            subtitle: 'city'
          }
        }
      }]
    },
    {
      name: 'createdAt',
      title: 'Client depuis le',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email'
    },
    prepare({ firstName, lastName, email }: any) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: email
      }
    }
  }
}