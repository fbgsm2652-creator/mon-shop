"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { client } from "@/sanity/lib/client";
import { useInvoice } from "@/hooks/use-invoice"; 
import { FileText, Package, MapPin, User, Receipt, ChevronRight, Truck } from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { generateInvoice } = useInvoice();

  useEffect(() => {
    if (isLoaded && user) {
      const fetchData = async () => {
        try {
          // Requête combinée : Commandes + Settings du Back-Office
          const query = `{
            "orders": *[_type == "order" && clerkId == $clerkId] | order(orderDate desc){
              ...,
              "items": items[]{ ..., productName, imei, vatType, price, quantity }
            },
            "siteSettings": *[_type == "settings"][0] 
          }`;
          
          const data = await client.fetch(query, { clerkId: user.id });
          
          // On attache les settings à chaque commande pour que le PDF soit dynamique
          const enrichedOrders = data.orders.map((order: any) => ({
            ...order,
            siteSettings: data.siteSettings
          }));

          setOrders(enrichedOrders || []);
        } catch (error) {
          console.error("Erreur Sanity:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="p-20 text-center font-[1000] animate-pulse text-blue-600 uppercase italic tracking-tighter">
        Chargement du dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-white">
      <div className="mb-12">
        <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#111111]">
          Mon Espace <span className="text-blue-600">.</span>
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Suivi de vos achats et garanties</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-2">
          <Link href="/mon-compte/commandes" className="flex items-center gap-4 p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all border border-blue-100">
            <Receipt size={20} />
            <span className="text-[13px] uppercase tracking-wider">Commandes</span>
          </Link>
          <Link href="/mon-compte/adresse" className="flex items-center justify-between gap-4 p-4 text-gray-400 hover:bg-gray-50 rounded-2xl font-bold transition-all group">
            <div className="flex items-center gap-4">
              <MapPin size={20} />
              <span className="text-[13px] uppercase tracking-wider group-hover:text-[#111111]">Adresse</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
          </Link>
          <Link href="/mon-compte/profil" className="flex items-center justify-between gap-4 p-4 text-gray-400 hover:bg-gray-50 rounded-2xl font-bold transition-all group">
            <div className="flex items-center gap-4">
              <User size={20} />
              <span className="text-[13px] uppercase tracking-wider group-hover:text-[#111111]">Profil</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
          </Link>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {orders.length === 0 ? (
            <div className="p-20 border-2 border-dashed border-gray-100 rounded-[3rem] text-center">
              <Package className="mx-auto text-gray-200 mb-4" size={40} />
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucune commande trouvée</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 hover:border-blue-500 transition-all duration-500 group">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
                        <Package size={24} />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Réf: {order.orderNumber}</h3>
                        <p className="text-xl font-black text-[#111111] uppercase">Détails de l'achat</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className={`text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.isPaid ? '✓ Payé' : '⌛ Attente Paiement'}
                      </span>
                      {order.trackingNumber && (
                        <span className="text-[11px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                          <Truck size={14} /> Suivi : {order.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 border-t border-gray-50 pt-4">
                        {order.items?.map((item: any, idx: number) => (
                            <p key={idx} className="text-[12px] font-bold text-gray-600 italic">
                                • {item.productName} {item.imei && <span className="text-blue-500 font-black ml-2">[IMEI: {item.imei}]</span>}
                            </p>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
                    <p className="text-3xl font-[1000] italic text-[#111111] tracking-tighter">{order.totalAmount?.toFixed(2)}€</p>
                    <button 
                      onClick={() => generateInvoice(order)}
                      className="w-full lg:w-auto flex items-center justify-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl"
                    >
                      <FileText size={18} /> Facture PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}