"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ShippingFormProps {
  savedAddresses: any[];
  isSignedIn: boolean;
}

export default function ShippingForm({ savedAddresses, isSignedIn }: ShippingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [selectedAddressKey, setSelectedAddressKey] = useState(
    savedAddresses.find((a) => a.isDefault)?._key || (savedAddresses.length > 0 ? savedAddresses[0]._key : "")
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Ajouté : crucial pour les invités
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // On récupère l'adresse choisie
    const finalAddress = selectedAddressKey 
      ? savedAddresses.find(a => a._key === selectedAddressKey)
      : formData;

    // IMPORTANT : On sauvegarde l'email séparément pour la page de succès/création de compte
    const customerEmail = selectedAddressKey ? (finalAddress.email || "") : formData.email;
    
    localStorage.setItem("customer-email", customerEmail);
    localStorage.setItem("selected-shipping-address", JSON.stringify(finalAddress));
    localStorage.setItem("customer-info", JSON.stringify(finalAddress)); // Pour compatibilité avec ta SuccessPage

    setTimeout(() => {
      router.push("/checkout/payment");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      <div className="lg:col-span-2 space-y-10">
        
        {/* 1. ADRESSES ENREGISTRÉES */}
        {isSignedIn && savedAddresses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Vos adresses de confiance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr._key}
                  onClick={() => setSelectedAddressKey(addr._key)}
                  className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${
                    selectedAddressKey === addr._key 
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-600/5 scale-[1.02]" 
                    : "border-transparent bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {addr.label || "Maison"}
                    </span>
                    {selectedAddressKey === addr._key && (
                      <div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-[15px] text-[#111111]">{addr.street}</p>
                  <p className="text-gray-500 text-[13px] font-medium">{addr.zipCode} {addr.city}</p>
                </div>
              ))}
              
              <div 
                onClick={() => setSelectedAddressKey("")}
                className={`p-6 rounded-[2.5rem] border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  selectedAddressKey === "" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className="text-xl">+</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Autre adresse</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. FORMULAIRE MANUEL / INVITÉ */}
        {(!isSignedIn || selectedAddressKey === "") && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Détails de livraison</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Prénom" className="input-renw" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input required placeholder="Nom" className="input-renw" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
              {/* CHAMP EMAIL AJOUTÉ ICI */}
              <input required type="email" placeholder="E-mail pour le suivi" className="input-renw" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <input required placeholder="Adresse (Rue, numéro...)" className="input-renw" onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Code Postal" className="input-renw" onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                <input required placeholder="Ville" className="input-renw" onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <input required type="tel" placeholder="Téléphone" className="input-renw" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
        )}
      </div>

      {/* 3. RÉSUMÉ */}
      <div className="lg:col-span-1">
        <div className="bg-[#111111] text-white p-8 rounded-[2.5rem] sticky top-32 shadow-2xl shadow-black/20">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 opacity-50">Étape 2/3</h3>
           <p className="text-lg font-bold mb-8 leading-tight">Expédition sécurisée par RENW</p>
           
           <button 
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
           >
             {loading ? "Chargement..." : "Continuer →"}
           </button>
        </div>
      </div>

    </form>
  );
}