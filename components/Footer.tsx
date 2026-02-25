import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { CreditCard, ShieldCheck } from "lucide-react"; 

export default async function Footer() {
  const settings = await client.fetch(
    `*[_type == "footerSettings"][0]`, 
    {}, 
    { cache: 'no-store' }
  );

  if (!settings) return null;

  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <footer style={eliteFont} className="bg-[#FBFBFD] border-t border-gray-100 pt-24 pb-12 mt-32 antialiased text-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* GRILLE PRINCIPALE */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-20">
          
          {/* COLONNE GAUCHE : MARQUE, TEXTE SANITY ET PAIEMENT */}
          <div className="lg:w-1/3 flex flex-col">
            <Link href="/" className="block hover:opacity-80 transition-opacity mb-8 inline-block w-fit">
              {settings.logoImage ? (
                <Image 
                  src={urlFor(settings.logoImage).url()} 
                  alt={`${settings.logoText} - Expertise Reconditionnement`} 
                  width={140} 
                  height={55} 
                  className="object-contain"
                />
              ) : (
                <span className="text-[32px] md:text-[36px] font-bold tracking-tighter uppercase text-[#111111]">
                  {settings.logoText}<span className="text-[#0066CC]">.</span>
                </span>
              )}
            </Link>
            
            {/* 🔥 TON TEXTE GÉRÉ DEPUIS SANITY (settings.vision) 🔥 */}
            <p className="text-[15px] md:text-[16px] text-gray-500 leading-[1.8] font-medium mb-12 max-w-sm">
              {settings.vision}
            </p>

            {/* ADRESSE DEPUIS SANITY */}
            <address className="not-italic space-y-2 mb-10 border-l-2 border-[#0066CC] pl-4">
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Siège Social</p>
              <p className="text-[14px] font-medium text-[#111111] leading-snug max-w-[250px] whitespace-pre-line">
                {settings.address}
              </p>
            </address>

            {/* BLOC RÉASSURANCE PAIEMENT */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#0066CC]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">Paiement 100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="w-10 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[8px] font-bold shadow-sm">VISA</div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[8px] font-bold shadow-sm">MASTER</div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[8px] font-bold shadow-sm">AMEX</div>
                <div className="w-10 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center shadow-sm"><CreditCard className="w-4 h-4 text-gray-700" /></div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : NAVIGATION DYNAMIQUE SANITY */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-10 pt-2 lg:pt-0">
            {settings.sections?.slice(0, 3).map((section: any, idx: number) => (
              <nav key={idx} aria-labelledby={`footer-nav-${idx}`} className="flex flex-col">
                <h3 id={`footer-nav-${idx}`} className="text-[14px] font-bold text-[#111111] mb-6 flex items-center gap-0">
                  {section.title}
                </h3>
                
                <ul className="space-y-4">
                  {section.links?.map((link: any, lIdx: number) => (
                    <li key={lIdx}>
                      <Link href={link.url || "#"} className="text-[15px] font-medium text-gray-500 hover:text-[#0066CC] transition-colors flex items-center w-fit group">
                        {link.label}
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#0066CC] ml-1 text-[12px]">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

        </div>

        {/* LIGNE DE SÉPARATION FINE */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10" />

        {/* BAS DU FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-[12px] md:text-[13px] text-gray-400 font-medium">
              © {new Date().getFullYear()} <span className="font-bold text-[#111111]">{settings.logoText}</span>. Tous droits réservés.
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              {settings.locationCity} • {settings.locationCountry}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}