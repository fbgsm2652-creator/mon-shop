"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Effet de halo signature RENW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="text-center px-6">
        {/* Badge dynamique */}
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-blue-600 font-black tracking-[0.4em] uppercase text-[10px] mb-6 block italic"
        >
          Expertise Tech & Reconditionné Certifié
        </motion.span>

        {/* Titre Impactant (Sémantique H1) */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-[100px] font-[1000] tracking-tighter mb-8 leading-[0.9] text-[#111111] italic"
        >
          L'AVENIR SE <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            DÉCODE ICI.
          </span>
        </motion.h1>

        {/* Texte descriptif aligné business */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-500 max-w-xl mx-auto mb-12 text-sm md:text-base font-medium leading-relaxed"
        >
          Découvrez une sélection de pièces certifiées et d'iPhones reconditionnés avec une précision chirurgicale pour une performance sans compromis.
        </motion.p>

        {/* Bouton d'appel à l'action Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/boutique">
            <button className="bg-[#111111] text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 active:scale-95">
              Explorer la collection
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Décoration minimaliste bas de section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent" />
      </div>
    </section>
  );
}