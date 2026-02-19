import { HomeIcon } from '@sanity/icons'

const homeSettings = {
  name: 'homeSettings',
  title: 'Accueil & SEO Global',
  type: 'document',
  icon: HomeIcon,
  fields: [
    { name: 'headerScripts', title: 'Scripts (Pixels)', type: 'text', rows: 3 },
    
    // SLIDER
    {
      name: 'slider',
      title: 'Slider Principal',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'link', title: 'Lien du bouton', type: 'string' },
          { name: 'showBadge', title: 'Afficher "Nos Sélections"', type: 'boolean' }
        ]
      }]
    },

    // --- NOUVEAU : BOUTON TRANSITION 1 (Sous Slider) ---
    { name: 'btnTransition1', title: 'Texte Bouton Sélection (Sous Slider)', type: 'string', initialValue: 'NOS SÉLECTIONS' },

    // BENTO GRID
    { name: 'bentoGrid', title: 'Grille Bento', type: 'array', of: [{ type: 'object', fields: [{ name: 'image', title: 'Image', type: 'image' }, { name: 'title', title: 'Titre', type: 'string' }, { name: 'link', title: 'Lien', type: 'string' }] }] },

    // REASSURANCE
    { name: 'reassurance', title: 'Logos de Réassurance', type: 'array', of: [{ type: 'object', fields: [{ name: 'icon', title: 'Icône', type: 'image' }, { name: 'text', title: 'Texte court', type: 'string' }] }] },

    // TEXTE SEO
    { name: 'seoBlock', title: 'Bloc Texte SEO', type: 'object', fields: [{ name: 'title', title: 'Titre SEO', type: 'string' }, { name: 'content', title: 'Contenu', type: 'text' }] },

    // --- NOUVEAU : BOUTON TRANSITION 2 (Avant Produits) ---
    { name: 'btnTransition2', title: 'Texte Bouton Produits (Sous Texte SEO)', type: 'string', initialValue: 'NOS PRODUITS PHARES' },

    // PRODUITS PHARES
    { name: 'featuredProducts', title: 'Produits Phares', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
  ]
}

export default homeSettings