"use client";

import { useState, useEffect } from "react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { useUser } from "@clerk/nextjs";
import { client as publicClient } from "@/sanity/lib/client";
// 👇 IMPORT CORRIGÉ ICI 👇
import { createOrderAction } from "../../actions/checkout-actions";

export default function ShippingPage() {
  const cart = useCart();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [country, setCountry] = useState("FR");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", zipCode: "", phone: ""
  });

  useEffect(() => {
    if (isSignedIn && user) {
        setFormData(prev => ({
          ...prev,
          email: user.primaryEmailAddress?.emailAddress || "",
          firstName: user.firstName || "",
          lastName: user.lastName || ""
        }));
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await publicClient.fetch(
          `*[_type == "shippingMethod" && $country in zones] | order(price asc)`, 
          { country }
        );
        setShippingMethods(data);
        if (data.length > 0) setSelectedShipping(data[0]);
      } catch (error) { console.error(error); }
    };
    fetchMethods();
  }, [country]);

  const subtotal = cart.items.reduce((acc, item) => acc + Number(item.price), 0);
  const shippingPrice = selectedShipping?.price || 0;
  const total = subtotal + shippingPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.items.map((item: any, index: number) => {
        return {
          _key: `item-${index}-${Date.now()}`,
          productName: item.name, 
          color: item.color || "N/A",      
          storage: item.capacity || "N/A",  
          condition: item.grade || "N/A",   
          price: Number(item.price),
          quantity: 1,
        };
      });

      const orderData = {
        _type: 'order',
        orderNumber: `RENW-${Math.floor(100000 + Math.random() * 900000)}`,
        clerkId: user?.id || "guest",
        isPaid: false, 
        status: 'pending',
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.zipCode} ${formData.city} (${country})`,
        },
        items: orderItems,
        totalAmount: total,
        shippingName: selectedShipping?.name || "Standard",
        orderDate: new Date().toISOString(),
      };

      // 🚀 APPEL DE LA FONCTION SÉCURISÉE
      const result = await createOrderAction(orderData, formData, user?.id || null);

      if (result.success && result.orderId) {
        localStorage.setItem("current-order-id", result.orderId);
        router.push("/checkout/payment");
      } else {
        alert("Erreur: " + result.error);
      }
      
    } catch (err: any) {
      console.error("ERREUR:", err);
      alert("Erreur lors de la validation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* PARTIE GAUCHE (RESTE INCHANGÉE) */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 border-r border-gray-50">
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
            <h1 className="text-[22px] font-black uppercase tracking-widest text-blue-600">LIVRAISON</h1>
            
            <div className="space-y-4">
              <select className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl font-bold" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input required value={formData.firstName} placeholder="Prénom" className="px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input required value={formData.lastName} placeholder="Nom" className="px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <input required value={formData.email} type="email" placeholder="Email" className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required value={formData.address} placeholder="Adresse" className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required value={formData.zipCode} placeholder="Code Postal" className="px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                <input required value={formData.city} placeholder="Ville" className="px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <input required value={formData.phone} placeholder="Téléphone" className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="pt-6">
              <h2 className="text-[12px] font-black uppercase tracking-widest mb-4 opacity-50">Transporteur</h2>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label key={method._id} className={`flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all ${selectedShipping?._id === method._id ? 'border-blue-600 bg-blue-50/50' : 'border-transparent bg-[#F5F5F7]'}`}>
                    <input type="radio" name="ship" className="hidden" checked={selectedShipping?._id === method._id} onChange={() => setSelectedShipping(method)} />
                    <span className="text-[13px] font-bold uppercase">{method.name}</span>
                    <span className="text-[13px] font-black">{method.price === 0 ? "OFFERT" : `${method.price}€`}</span>
                  </label>
                ))}
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#111111] text-white py-6 rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-blue-600 transition-all">
              {loading ? "Vérification..." : `Continuer (${total}€)`}
            </button>
          </form>
        </div>

        {/* PARTIE DROITE : RÉSUMÉ CORRIGÉ */}
        <div className="w-full lg:w-1/2 bg-[#F5F5F7] p-8 md:p-16 lg:p-24 border-l border-gray-100 hidden lg:block">
          <div className="max-w-md mx-auto sticky top-24">
            <h2 className="text-[18px] font-black tracking-widest mb-10 uppercase text-[#111111]">
              Votre Commande<span className="text-blue-600">.</span>
            </h2>
            
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <div key={item._id} className="flex items-center p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                  
                  {/* Image corrigée : on utilise item.images[0] */}
                  <div className="h-16 w-16 shrink-0 bg-[#F5F5F7] rounded-xl overflow-hidden p-2 flex items-center justify-center">
                    {item.images && item.images[0] && (
                      <img 
                        src={urlFor(item.images[0]).url()} 
                        className="h-full w-full object-contain mix-blend-multiply" 
                        alt={item.name} 
                      />
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <p className="text-[14px] font-bold leading-tight uppercase">{item.name}</p>
                    
                    {/* Variantes alignées comme sur ton panier */}
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <span className="text-[#111111]">{item.color}</span>
                       <span>|</span>
                       <span className="text-blue-600">{item.capacity}</span>
                       <span>|</span>
                       <span className="bg-[#F5F5F7] px-1.5 py-0.5 rounded text-[9px] text-[#111111] border border-gray-100">{item.grade}</span>
                    </div>
                  </div>
                  
                  <p className="text-[14px] font-bold text-blue-600 ml-4">{item.price}€</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 space-y-4">
              <div className="flex justify-between text-[13px] font-medium text-gray-500">
                <span>Sous-total</span>
                <span>{subtotal}€</span>
              </div>
              <div className="flex justify-between text-[13px] font-medium text-gray-500">
                <span>Frais de livraison</span>
                <span className="text-blue-600 font-bold uppercase text-[11px]">{selectedShipping?.price === 0 ? "Offert" : `${selectedShipping?.price}€`}</span>
              </div>
              
              <div className="flex justify-between text-[24px] font-black pt-6 border-t border-gray-100 mt-6">
                <span className="tracking-tighter uppercase">Total TTC</span>
                <span className="text-blue-600">{total}€</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}