import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default async function Footer() {
  // On force la mise à jour pour éviter le cache
  const settings = await client.fetch(
    `*[_type == "footerSettings"][0]`, 
    {}, 
    { cache: 'no-store' }
  );

  if (!settings) return null;

  const eliteFont = { fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };

  return (
    <footer style={eliteFont} className="bg-white border-t border-gray-200 pt-24 pb-12 mt-40 selection:bg-[#0066CC] selection:text-white text-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-20 border-b border-gray-200 pb-20">
          
          {/* PARTIE 1 : INFO ENTREPRISE */}
          <div className="pr-8 space-y-6 pb-10 md:pb-0">
            <Link href="/" className="block hover:opacity-80 transition-opacity">
              {settings.logoImage ? (
                <Image 
                  src={urlFor(settings.logoImage).url()} 
                  alt={`${settings.logoText} - Expertise Reconditionnement`} 
                  width={140} 
                  height={55} 
                  className="object-contain"
                />
              ) : (
                <span className="text-[32px] font-bold tracking-tighter uppercase text-[#111111]">
                  {settings.logoText}<span className="text-[#0066CC]">.</span>
                </span>
              )}
            </Link>
            <p className="text-[15px] md:text-[16px] text-[#111111] leading-relaxed font-medium">
              {settings.vision}
            </p>
            <address className="not-italic space-y-2 pt-4">
              {/* Titre passé en Gris */}
              <p className="text-[15px] font-bold text-gray-500">Siège Social</p>
              <p className="text-[14px] md:text-[15px] font-medium text-[#111111] leading-snug max-w-[250px]">
                {settings.address}
              </p>
            </address>
          </div>

          {/* PARTIE DYNAMIQUE (Colonnes de liens) */}
          {settings.sections?.slice(0, 3).map((section: any, idx: number) => (
            <nav key={idx} aria-labelledby={`footer-nav-${idx}`} className="px-0 md:px-10 border-t md:border-t-0 md:border-l border-gray-200 pt-10 md:pt-0">
              {/* La petite barre passée en BLEU RENW */}
              <div className="hidden md:block h-8 w-[3px] bg-[#0066CC] mb-6 rounded-full" />
              
              {/* 🔥 CORRECTION ACCESSIBILITÉ : h4 remplacé par h3 */}
              <h3 id={`footer-nav-${idx}`} className="text-[16px] md:text-[18px] font-bold text-gray-500 mb-6">
                {section.title}
              </h3>
              
              <ul className="space-y-4">
                {section.links?.map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    {/* Liens en Noir Pur */}
                    <Link href={link.url || "#"} className="text-[15px] md:text-[16px] font-medium text-[#111111] hover:text-[#0066CC] transition-colors flex items-center group relative w-fit pb-1">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111111] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* BAS DU FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[12px] md:text-[13px] text-[#111111] uppercase tracking-[0.15em] font-bold text-center md:text-left">
            © {new Date().getFullYear()} {settings.logoText} — TECHNOLOGY FOR THE FUTURE.
          </span>
          <div className="flex items-center gap-3 bg-[#F5F5F7] px-5 py-3 rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0066CC] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,102,204,0.6)]" />
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#111111]">
              {settings.locationCity} | {settings.locationCountry}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}