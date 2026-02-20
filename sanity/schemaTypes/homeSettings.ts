import { defineField, defineType } from 'sanity'
import { Home } from 'lucide-react'

export const homeSettings = defineType({
  name: 'homeSettings',
  title: 'Page d\'Accueil',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'hero', title: '1. Hero & Slider' },
    { name: 'bento', title: '2. Grille Catégories' },
    { name: 'reassurance', title: '3. Réassurance' },
    { name: 'seo', title: '4. Texte SEO' },
    { name: 'products', title: '5. Produits Phares' },
  ],
  fields: [
    // --- 1. HERO SLIDER ---
    defineField({
      name: 'slider',
      title: 'Slider Principal (Haut de page)',
      type: 'array',
      group: 'hero',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', title: 'Image de fond', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() },
          { name: 'alt', title: 'Texte alternatif (SEO)', type: 'string', description: 'Très important pour Google Images.' },
          { name: 'showBadge', title: 'Afficher le badge semi-transparent', type: 'boolean', initialValue: true },
          { name: 'link', title: 'Lien du bouton "Découvrir"', type: 'string', description: 'Ex: /smartphones' }
        ],
        preview: {
          select: { title: 'alt', subtitle: 'link', media: 'image' },
        }
      }]
    }),

    // --- 2. BOUTON TRANSITION 1 ---
    defineField({
      name: 'btnTransition1',
      title: 'Bouton de Transition 1',
      type: 'string',
      group: 'bento',
      description: 'Le bouton long juste avant la grille (Ex: "NOS SÉLECTIONS")',
    }),

    // --- 3. BENTO GRID ---
    defineField({
      name: 'bentoGrid',
      title: 'Grille d\'images (Bento)',
      description: 'Ajoute 4 éléments pour respecter le design asymétrique (le 1er et le 4ème seront plus grands).',
      type: 'array',
      group: 'bento',
      validation: Rule => Rule.max(4),
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Titre affiché sur l\'image', type: 'string', validation: Rule => Rule.required() },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() },
          { name: 'link', title: 'Lien de destination', type: 'string', description: 'Ex: /iphone' }
        ],
        preview: {
          select: { title: 'title', media: 'image' }
        }
      }]
    }),

    // --- 4. RÉASSURANCE ---
    defineField({
      name: 'reassurance',
      title: 'Blocs de Réassurance (Gris)',
      type: 'array',
      group: 'reassurance',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Icône (Image PNG/SVG)', type: 'image' },
          { name: 'text', title: 'Texte', type: 'string' }
        ],
        preview: {
          select: { title: 'text', media: 'icon' }
        }
      }]
    }),

    // --- 5. BLOC TEXTE SEO ---
    defineField({
      name: 'seoBlock',
      title: 'Bloc Texte Central (SEO)',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'title', title: 'Grand Titre', type: 'string', description: 'Ex: Expertise Tech & Reconditionné Certifié' },
        { name: 'content', title: 'Texte descriptif', type: 'text', rows: 4, description: 'Le texte justifié en gris.' }
      ]
    }),

    // --- 6. BOUTON TRANSITION 2 ---
    defineField({
      name: 'btnTransition2',
      title: 'Bouton de Transition 2',
      type: 'string',
      group: 'products',
      description: 'Le bouton long juste avant les produits (Ex: "NOS PRODUITS PHARES")',
    }),

    // --- 7. PRODUITS PHARES ---
    defineField({
      name: 'featuredProducts',
      title: 'Produits Phares à afficher',
      type: 'array',
      group: 'products',
      validation: Rule => Rule.max(8), // Pour ne pas casser le design
      of: [{
        type: 'reference',
        to: [{ type: 'product' }] // Référence ton schéma produit existant
      }]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contenu de la Page d\'Accueil',
        subtitle: 'Gérer la vitrine du site'
      }
    }
  }
})