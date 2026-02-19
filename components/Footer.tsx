"use client";

import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { urlFor } from "@/sanity/lib/image";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await client.fetch(`*[_type == "footerSettings"][0]`);
        setSettings(data);
      } catch (error) {
        console.error("Erreur chargement Footer Sanity:", error);
      } finally {
        setIsLoaded(true); 
      }
    }
    fetchSettings();
  }, []);

  if (!isLoaded) return null;

  const impactFont = { fontFamily: "'Inter', sans-serif" };

  return (
    <footer style={impactFont} className="bg-[#FAFAFA] border-t border-gray-200 pt-24 pb-12 mt-40 selection:bg-blue-100 text-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* GRILLE PRINCIPALE EN 4 COLONNES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-24 border-b border-gray-200 pb-20">
          
          {/* PARTIE 1 : INFO ENTREPRISE */}
          <div className="pr-8 space-y-8 pb-10 md:pb-0">
            <Link href="/" className="block hover:opacity-80 transition-opacity">
              {settings?.logoImage ? (
                <Image 
                  src={urlFor(settings.logoImage).url()} 
                  alt={settings?.logoText || "RENW"} 
                  width={120} 
                  height={50} 
                  className="object-contain"
                />
              ) : (
                <span className="text-3xl font-[1000] tracking-tighter uppercase italic">
                  RENW<span className="text-blue-600">.</span>
                </span>
              )}
            </Link>
            <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
              {settings?.vision || "Expertise certifiée dans le reconditionnement de haute technologie et pièces détachées premium."}
            </p>
            <address className="not-italic space-y-4 pt-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Siège Social</p>
              <p className="text-[13px] font-bold text-gray-800 leading-snug max-w-[200px]">
                {settings?.address || "France / Algérie"}
              </p>
            </address>
          </div>

          {/* PARTIE 2, 3, 4 : DYNAMIQUES (LIGNES BLEUES MÉGA MENU) */}
          {settings?.sections && settings.sections.length > 0 ? (
            settings.sections.slice(0, 3).map((section: any, idx: number) => (
              <div key={idx} className="px-0 md:px-10 border-t md:border-t-0 md:border-l border-gray-200 pt-10 md:pt-0">
                <div className="hidden md:block h-6 w-[2px] bg-blue-600 mb-6" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 italic">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links?.map((link: any, lIdx: number) => (
                    <li key={lIdx}>
                      <Link href={link.url || "#"} className="text-[14px] font-[700] text-gray-700 hover:text-blue-600 transition-all flex items-center group">
                        <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className="px-0 md:px-10 border-l border-gray-200">
                <div className="h-6 w-[2px] bg-blue-600 mb-6" />
                <h4 className="text-[10px] font-black uppercase text-blue-600 mb-8 italic">Catalogue</h4>
                <ul className="text-[14px] font-bold text-gray-400 space-y-4"><li>Bientôt disponible</li></ul>
              </div>
              <div className="px-0 md:px-10 border-l border-gray-200">
                <div className="h-6 w-[2px] bg-blue-600 mb-6" />
                <h4 className="text-[10px] font-black uppercase text-blue-600 mb-8 italic">Assistance</h4>
                <ul className="text-[14px] font-bold text-gray-400 space-y-4"><li>Contactez-nous</li></ul>
              </div>
              <div className="px-0 md:px-10 border-l border-gray-200">
                <div className="h-6 w-[2px] bg-blue-600 mb-6" />
                <h4 className="text-[10px] font-black uppercase text-blue-600 mb-8 italic">Légal</h4>
                <ul className="text-[14px] font-bold text-gray-400 space-y-4"><li>Mentions légales</li></ul>
              </div>
            </>
          )}
        </div>

        {/* BAS DU FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black italic">
            © {new Date().getFullYear()} {settings?.logoText || "RENW"} — TECHNOLOGY FOR THE FUTURE.
          </span>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-[1000] uppercase tracking-widest text-[#111111]">
              {settings?.locationCity || "Paris"} | {settings?.locationCountry || "France"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}