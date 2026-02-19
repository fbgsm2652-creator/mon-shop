"use client";

import { useState, useRef } from "react";
import { addAddress } from "@/app/actions/address-actions";
import toast from "react-hot-toast";
import { MapPin, Loader2 } from "lucide-react";

export default function AddressForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await addAddress(formData);
      toast.success("Adresse enregistrée avec succès !");
      formRef.current?.reset();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form 
      ref={formRef}
      action={handleSubmit} 
      className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
          <MapPin size={18} />
        </div>
        <h2 className="text-[14px] font-[900] uppercase tracking-[0.2em] text-[#111111]">
          Nouvelle Adresse
        </h2>
      </div>

      <div className="space-y-4">
        {/* Rue : autocomplete "street-address" */}
        <div className="relative">
          <input 
            name="street" 
            type="text"
            placeholder="N° et nom de rue" 
            required 
            autoComplete="street-address"
            className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* CP : autocomplete "postal-code" */}
          <input 
            name="zipCode" 
            type="text"
            placeholder="Code postal" 
            required 
            autoComplete="postal-code"
            className="bg-[#F5F5F7] border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
          {/* Ville : autocomplete "address-level2" */}
          <input 
            name="city" 
            type="text"
            placeholder="Ville" 
            required 
            autoComplete="address-level2"
            className="bg-[#F5F5F7] border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#111111] text-white font-[900] uppercase tracking-[0.2em] text-[11px] py-6 rounded-full hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Traitement...
          </>
        ) : (
          "Enregistrer l'adresse"
        )}
      </button>
    </form>
  );
}