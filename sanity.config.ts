"use client";

import { defineConfig, buildLegacyTheme } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schema } from './sanity/schemaTypes'; 

// --- 1. CRÉATION DU THÈME RENW (Visibilité et Couleurs) ---
const props = {
  "--my-white": "#fff",
  "--my-black": "#111",
  "--renw-blue": "#2563eb",
  "--my-gray": "#f4f4f5",
};

export const myTheme = buildLegacyTheme({
  /* Couleurs principales */
  "--black": props["--my-black"],
  "--white": props["--my-white"],
  "--gray": "#666",
  "--brand-primary": props["--renw-blue"],
  
  /* Arrière-plan et texte */
  "--component-bg": props["--my-white"],
  "--component-text-color": props["--my-black"],
  
  /* Boutons et Navigation */
  "--default-button-primary-color": props["--renw-blue"],
  "--main-navigation-color": props["--my-black"],
  "--main-navigation-color--inverted": props["--my-white"],
  
  /* État actif / Focus */
  "--focus-color": props["--renw-blue"],
  "--state-info-color": props["--renw-blue"],
});

// --- 2. CONFIGURATION DU STUDIO ---
export default defineConfig({
  name: 'default',
  title: 'RENW. GESTION',

  projectId: 'dhd0ohjg', 
  dataset: 'production',
  basePath: '/studio', 

  plugins: [
    deskTool(), 
    visionTool(),
  ],

  schema: {
    types: schema.types,
  },

  // On applique le thème ici
  theme: myTheme,
})