"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export default function AutoSlider({ slides, btnText }: { slides: any[], btnText: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const btnSliderStyle = "inline-flex items-center justify-center bg-[#E0F0FF] text-[#0066CC] px-8 py-4 rounded-xl font-normal text-[12px] md:text-[14px] tracking-widest shadow-[0_8px_30px_rgba(0,102,204,0.2)] hover:shadow-[0_15px_40px_rgba(0,102,204,0.3)] transition-all duration-300 group/btn";

  return (
    <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.15)] bg-[#F5F5F7]">
      {/* Piste coulissante */}
      <div 
        className="flex h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="shrink-0 w-full h-full relative group flex items-center justify-center">
            {/* Image dégagée */}
            <div className="relative w-[80%] h-[80%] md:w-[60%] md:h-[60%] z-10">
              <Image 
                src={urlFor(slide.image).url()} 
                alt={slide.alt || "Expertise Renw Tech"} 
                fill 
                className="object-contain drop-shadow-2xl mix-blend-multiply" 
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"} /* 🔥 AJOUT POUR GOOGLE PAGESPEED 🔥 */
                sizes="(max-width: 768px) 80vw, 60vw"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent z-20"></div>
            
            {/* Textes et Bouton */}
            <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 max-w-2xl text-left z-30">
              {slide.showBadge && (
                <span className="inline-block px-4 py-1.5 mb-4 bg-white/80 backdrop-blur-md border border-gray-200 text-[#111111] rounded-lg font-normal text-[10px] md:text-[11px] uppercase tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  L'Art du Reconditionné
                </span>
              )}
              <h2 className="text-[32px] md:text-[56px] font-normal text-[#111111] tracking-tighter leading-[1.1] mb-6">
                Passez au meilleur<br/>de la tech.
              </h2>
              {/* 🔥 CORRECTION SEO/ACCESSIBILITÉ : Ajout de aria-label pour différencier les liens 🔥 */}
              <Link 
                href={slide.link || "/"} 
                className={btnSliderStyle}
                aria-label={`Découvrir le produit : ${slide.alt || 'Promotion ' + (index + 1)}`}
              >
                Découvrir l'expertise
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover/btn:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Petits points de navigation en bas */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-6 md:bottom-8 md:right-12 z-30 flex gap-1">
          {slides.map((_, idx) => (
            /* 🔥 CORRECTION ACCESSIBILITÉ : p-3 rajouté pour agrandir la zone cliquable sans modifier le visuel 🔥 */
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className="p-3 focus:outline-none"
              aria-label={`Aller à la diapositive ${idx + 1}`}
            >
              <div className={`h-2 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-8 bg-[#0066CC]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}