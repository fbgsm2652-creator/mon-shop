import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- GENERATION DES METADATAS POUR GOOGLE ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ metaTitle, metaDescription, title }`,
    { slug: params.slug }
  );

  if (!data) return { title: "Page non trouvée" };

  return {
    title: data.metaTitle || data.title,
    description: data.metaDescription || "Informations complémentaires sur RENW Algérie.",
  };
}

// --- AFFICHAGE DE LA PAGE ---
export default async function StaticPage({ params }: { params: { slug: string } }) {
  const data = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!data) notFound();

  const interFont = { fontFamily: '"Inter", sans-serif' };

  return (
    <main style={interFont} className="max-w-4xl mx-auto px-6 py-24 min-h-screen text-[#111111]">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-[1000] uppercase tracking-[ -0.05em] italic">
          {data.title}
        </h1>
        <div className="h-1 w-20 bg-blue-600 mt-6"></div>
      </div>
      
      <article className="prose prose-lg prose-slate max-w-none leading-relaxed text-gray-800">
        <PortableText value={data.content} />
      </article>

      {/* Bouton de retour rapide pour l'expérience utilisateur */}
      <div className="mt-20 pt-10 border-t border-gray-100">
        <a href="/" className="text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:opacity-70 transition-opacity">
          ← Retour à l'accueil
        </a>
      </div>
    </main>
  );
}