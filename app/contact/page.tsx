import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin } from "lucide-react"; // 🔥 L'icône Phone a été retirée
import { client } from "@/sanity/lib/client";

// --- SEO EXPLOSIF ---
export const metadata: Metadata = {
  title: "Nous Contacter",
  description: "Une question sur un produit reconditionné, une pièce détachée ou votre commande ? L'équipe RENW est à votre disposition. Contactez-nous dès maintenant.",
  alternates: {
    canonical: "https://renw.fr/contact",
  }
};

export default async function ContactPage() {
  // 1. On va chercher les paramètres globaux sur Sanity
  const settings = await client.fetch(`*[_type == "settings"][0]`, {}, { cache: 'no-store' });

  // 2. On récupère les valeurs de Sanity (ou on met des valeurs par défaut si vide)
  const pageTitle = settings?.contactPageTitle || "Comment pouvons-nous vous aider ?";
  const pageSubtitle = settings?.contactPageSubtitle || "Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions concernant nos produits, nos garanties ou le suivi de votre commande.";
  const contactHeading = settings?.contactHeading || "Entrons en contact.";
  
  const email = settings?.contactEmail || "contact@renw.fr";
  const emailSubtext = settings?.contactEmailSubtext || "Nous répondons généralement sous 24h.";
  
  // 🔥 Toute la partie Téléphone a été supprimée d'ici 🔥
  
  const address = settings?.contactAddress || "RENW France\n123 Avenue de la Technologie\n75000 Paris, France";

  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <main style={eliteFont} className="bg-white min-h-screen text-[#111111] antialiased">
      
      {/* En-tête de la page */}
      <div className="bg-[#F4F9FF] border-b border-[#E5F0FF] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-[32px] md:text-[48px] font-normal tracking-tighter mb-4 text-[#111111]">
            {pageTitle}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#111111] opacity-70 max-w-2xl mx-auto font-normal">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Contenu principal : Grille 2 colonnes */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Colonne Gauche : Informations dynamiques depuis Sanity */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[24px] md:text-[28px] font-normal tracking-tighter mb-8 text-[#111111]">
              {contactHeading}
            </h2>
            
            <div className="space-y-8">
              {/* Info Bloc 1 : Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                  <Mail className="text-[#0066CC]" size={20} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111111] mb-1">Email</h3>
                  <p className="text-[14px] text-[#111111] opacity-70 mb-1 font-normal">{emailSubtext}</p>
                  <a href={`mailto:${email}`} className="text-[15px] font-medium text-[#0066CC] hover:underline">{email}</a>
                </div>
              </div>

              {/* 🔥 Le bloc HTML Téléphone a été complètement retiré d'ici 🔥 */}

              {/* Info Bloc 2 : Siège Social */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                  <MapPin className="text-[#0066CC]" size={20} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111111] mb-1">Siège Social</h3>
                  <p className="text-[14px] text-[#111111] opacity-70 leading-relaxed font-normal whitespace-pre-line">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Le Formulaire */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <h2 className="text-[20px] md:text-[24px] font-normal tracking-tighter mb-6 text-[#111111]">
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}