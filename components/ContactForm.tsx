"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. On récupère les données tapées par le client
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      // 2. On envoie les données à notre API Resend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur serveur");

      // 3. Succès : on prévient le client et on vide le formulaire
      toast.success("Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h.");
      (e.target as HTMLFormElement).reset(); 
    } catch (error) {
      // 4. Erreur : on prévient le client
      toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full bg-[#F5F5F7] text-[#111111] rounded-xl py-4 px-5 text-[14px] font-normal outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[13px] font-bold text-[#111111] ml-1">Nom complet</label>
          <input type="text" id="name" name="name" required placeholder="Jean Dupont" className={inputStyle} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-bold text-[#111111] ml-1">Adresse e-mail</label>
          <input type="email" id="email" name="email" required placeholder="jean@exemple.com" className={inputStyle} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-[13px] font-bold text-[#111111] ml-1">Sujet de votre demande</label>
        {/* Correction React: Utilisation de defaultValue ici */}
        <select id="subject" name="subject" required defaultValue="" className={`${inputStyle} appearance-none cursor-pointer`}>
          <option value="" disabled>Sélectionnez un sujet...</option>
          <option value="Suivi de commande">Suivi de commande</option>
          <option value="Information produit">Information sur un produit</option>
          <option value="SAV & Garantie">SAV & Garantie</option>
          <option value="Autre">Autre demande</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-[13px] font-bold text-[#111111] ml-1">Votre message</label>
        <textarea id="message" name="message" required rows={5} placeholder="Comment pouvons-nous vous aider ?" className={`${inputStyle} resize-none`}></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[#0066CC] text-white py-4 rounded-xl text-[14px] font-normal tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(0,102,204,0.2)]"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
      
      <p className="text-[11px] text-[#111111] opacity-50 text-center mt-4 font-normal">
        Vos données sont sécurisées et ne seront jamais partagées à des tiers.
      </p>
    </form>
  );
}