"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà répondu
    const consent = localStorage.getItem("renw-cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("renw-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("renw-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:w-[380px] bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[9999] animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🍪</span>
        <h3 className="text-[15px] font-[900] text-[#111111] tracking-tight">Respect de votre vie privée</h3>
      </div>
      <p className="text-[13px] text-gray-500 mb-6 leading-relaxed font-medium">
        Nous utilisons des cookies pour assurer le bon fonctionnement du site, analyser notre trafic et vous proposer des offres adaptées.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={acceptCookies} 
          className="flex-1 bg-[#0066CC] text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          Accepter
        </button>
        <button 
          onClick={declineCookies} 
          className="flex-1 bg-[#F5F5F7] text-[#111111] py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
        >
          Continuer sans
        </button>
      </div>
    </div>
  );
}