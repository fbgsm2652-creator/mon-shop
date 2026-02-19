"use client";

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config'; 
import { Metadata } from 'next';

// --- SEO : INTERDICTION STRICTE D'INDEXATION ---
// Note : Comme c'est un "use client", les métadonnées sont souvent gérées 
// dans le layout du dossier /studio. Si tu n'as pas de layout spécifique,
// on s'assure que cette page est invisible pour les robots.
export const dynamic = 'force-static';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Le composant NextStudio gère sa propre interface. 
        Le fait d'avoir mis la condition !isStudio dans ton RootLayout 
        garantit que le Header/Footer n'apparaissent pas ici.
      */}
      <NextStudio config={config} />
    </div>
  );
}