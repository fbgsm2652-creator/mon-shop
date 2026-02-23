"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Ajout pour la redirection de sécurité
import { client } from "@/sanity/lib/client";
import { useInvoice } from "@/hooks/use-invoice";
import { shipOrderAction, resetOrderAction, cancelOrderAction } from "@/app/actions/order-actions"; 
import { 
  Package, Truck, Search, X, 
  RefreshCcw, TrendingUp, ShoppingCart, 
  CheckCircle2, Download, Layers, ChevronRight,
  MailCheck, ChevronLeft, Trash2,
  DollarSign, Activity
} from "lucide-react";

// --- TYPES ---
interface OrderItem {
  productName: string;
  currentStock: number;
  imei?: string;
  price?: number;
}

interface Order {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  orderNumber: string;
  orderDate?: string;
  status: string;
  totalAmount: number;
  totalCostPrice?: number;
  customer?: {
    name: string;
    email: string;
    city?: string;
  };
  items: OrderItem[];
}

export default function PreparationDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // --- SÉCURITÉ : VÉRIFICATION DES RÔLES ---
  // On récupère le rôle de Clerk, par défaut "client" si non défini
  const role = (user?.publicMetadata as { role?: string })?.role || "client";
  const isAdmin = role === "admin";
  const isPrep = role === "prep";

  // Redirection si l'utilisateur n'est pas autorisé
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn || (!isAdmin && !isPrep)) {
        // Renvoie l'utilisateur à l'accueil
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn, isAdmin, isPrep, router]);

  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState<"flux" | "history" | "finance">("flux");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { generateInvoice } = useInvoice();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [itemsImei, setItemsImei] = useState<{[key: string]: string}>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = `{
        "toPrepare": *[_type == "order" && status in ["pending", "processing"]] | order(orderDate asc) {
          ...,
          items[] { ..., "currentStock": product->stock }
        },
        "shipped": *[_type == "order" && status == "shipped"] | order(_updatedAt desc)[0...50] {
          ...,
          items[] { ..., "currentStock": product->stock }
        },
        "allForStats": *[_type == "order"] | order(orderDate desc) {
          ...,
          items[] { ..., "currentStock": product->stock }
        }
      }`;
      const data = await client.fetch(query);
      
      let targetOrders: Order[] = [];
      if (activeTab === "flux") targetOrders = data.toPrepare;
      else if (activeTab === "history") targetOrders = data.shipped;
      else targetOrders = data.allForStats;

      setOrders(targetOrders);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    // Ne charge les données que si l'utilisateur est autorisé
    if (isLoaded && (isAdmin || isPrep)) fetchOrders(); 
  }, [isLoaded, activeTab, isAdmin, isPrep]);

  // --- CALCULS STATS (LOGIQUE MÉTIER) ---
  const financeStats = useMemo(() => {
    return orders.reduce((acc, o) => {
      const ca = o.totalAmount || 0;
      const stripeFees = ca > 0 ? (ca * 0.015) + 0.25 : 0;
      const shipCost = 6.50; 
      const purchasePrice = o.totalCostPrice || (ca * 0.7); 
      const margeNet = ca - purchasePrice - stripeFees - shipCost;

      acc.ca += ca;
      acc.margeTotal += margeNet;
      acc.fraisTotal += (stripeFees + shipCost);
      acc.count += 1;
      return acc;
    }, { ca: 0, margeTotal: 0, fraisTotal: 0, count: 0 });
  }, [orders]);

  const averageBasket = financeStats.count > 0 ? financeStats.ca / financeStats.count : 0;
  
  const todaySales = orders.filter(o => {
    const d = o.orderDate || o._createdAt;
    return new Date(d).toDateString() === new Date().toDateString();
  }).length;

  // --- NOTIFICATIONS & ACTIONS ---
  const notifyCustomerByEmail = async (order: Order, trackNum: string) => {
    try {
      await fetch('/api/send-shipping-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.customer?.email,
          customerName: order.customer?.name,
          orderNumber: order.orderNumber,
          trackingNumber: trackNum
        }),
      });
    } catch (error) { console.error("❌ Erreur email expédition:", error); }
  };

  const notifySAV = async (order: Order, type: "RE-PREP" | "CANCEL") => {
    try {
      await fetch('/api/send-sav-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.customer?.email,
          customerName: order.customer?.name,
          orderNumber: order.orderNumber,
          type: type
        }),
      });
    } catch (error) { console.error("❌ Erreur email SAV:", error); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(orders.map(o => o._id));
    else setSelectedIds([]);
  };

  const goToNextOrder = () => {
    const currentIndex = orders.findIndex(o => o._id === selectedOrder?._id);
    if (currentIndex < orders.length - 1) {
      setSelectedOrder(orders[currentIndex + 1]);
      setTrackingNumber("");
    } else {
      setSelectedOrder(null);
      alert("🏁 Fin du flux de production !");
    }
  };

  const handleIndividualShip = async () => {
    if (!selectedOrder || isUpdating) return;
    setIsUpdating(true);
    try {
      const updatedItems = selectedOrder.items.map((item, index) => ({
        ...item,
        imei: itemsImei[`${selectedOrder._id}-${index}`] || item.imei || ""
      }));
      const response = await shipOrderAction(selectedOrder._id, trackingNumber, updatedItems);
      if (!response.success) throw new Error("Erreur Sanity");
      await notifyCustomerByEmail(selectedOrder, trackingNumber);
      const nextId = selectedOrder._id;
      setOrders(prev => prev.filter(o => o._id !== nextId));
      alert(`✅ Commande #${selectedOrder.orderNumber} expédiée !`);
      goToNextOrder();
    } catch (error) { alert("Erreur mise à jour"); } finally { setIsUpdating(false); }
  };

  // Si non chargé ou non autorisé, on n'affiche rien (évite les flashs)
  if (!isLoaded || (!isAdmin && !isPrep)) return null;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase italic tracking-widest text-[#111111] bg-white">CHARGEMENT DU QG RENW...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 md:p-10 font-sans text-[#111111] antialiased">
      <div className="max-w-7xl mx-auto pb-32">
        
        {/* HEADER DE NAVIGATION */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase text-gray-400 tracking-[0.3em]">
              <MailCheck className="text-green-500" size={16} /> Notification Mail Active
            </div>
            <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#111111]">
              {activeTab === "flux" ? "Flux Préparation" : activeTab === "history" ? "Historique Expéditions" : "Analyses & Finances"}
            </h1>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button onClick={() => setActiveTab("flux")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "flux" ? "bg-[#111111] text-white shadow-lg" : "text-gray-400"}`}>À Préparer</button>
            <button onClick={() => setActiveTab("history")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "history" ? "bg-[#111111] text-white shadow-lg" : "text-gray-400"}`}>Expédiés</button>
            {isAdmin && <button onClick={() => setActiveTab("finance")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "finance" ? "bg-[#111111] text-white shadow-lg" : "text-gray-400"}`}>Finances</button>}
          </div>
        </header>

        {/* --- ONGLET FINANCES (ADMIN) --- */}
        {activeTab === "finance" && isAdmin && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg"><TrendingUp size={20}/></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">C.A Brut</p>
                   </div>
                   <p className="text-2xl font-[1000] italic tracking-tighter">{financeStats.ca.toFixed(2)}€</p>
                </div>

                <div className="bg-[#111111] p-8 rounded-[2.5rem] shadow-2xl text-white">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg"><DollarSign size={20}/></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Marge Nette Est.</p>
                   </div>
                   <p className="text-2xl font-[1000] italic tracking-tighter text-blue-500">{financeStats.margeTotal.toFixed(2)}€</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><ShoppingCart size={20}/></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Panier Moyen</p>
                   </div>
                   <p className="text-2xl font-[1000] italic tracking-tighter">{averageBasket.toFixed(2)}€</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl"><Truck size={20}/></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frais Opér.</p>
                   </div>
                   <p className="text-2xl font-[1000] italic tracking-tighter text-red-500">-{financeStats.fraisTotal.toFixed(2)}€</p>
                </div>
             </div>
             
             <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center mb-8 px-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 italic">Détail des profits par commande</h2>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        <Download size={14} /> Exporter CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
                            <tr>
                                <th className="p-6">Réf</th>
                                <th className="p-6">Client</th>
                                <th className="p-6 text-center">Vente</th>
                                <th className="p-6 text-center">Frais</th>
                                <th className="p-6 text-right">Marge Net</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.slice(0, 15).map(o => {
                                const ca = o.totalAmount || 0;
                                const fees = (ca * 0.015) + 0.25 + 6.50;
                                const purchase = o.totalCostPrice || (ca * 0.7);
                                const net = ca - purchase - fees;
                                return (
                                    <tr key={o._id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="p-6 font-black italic text-[11px] uppercase tracking-tighter">#{o.orderNumber}</td>
                                        <td className="p-6 text-xs font-bold text-gray-600">{o.customer?.name}</td>
                                        <td className="p-6 text-center font-bold">{ca}€</td>
                                        <td className="p-6 text-center text-red-400 text-[10px]">-{fees.toFixed(2)}€</td>
                                        <td className={`p-6 text-right font-black italic ${net > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {net > 0 ? '+' : ''}{net.toFixed(2)}€
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {/* --- ONGLET FLUX ET HISTORIQUE --- */}
        {activeTab !== "finance" && (
          <>
            {isAdmin && activeTab === "flux" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-6 text-[#111111]">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100"><TrendingUp size={24} /></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase">Valeur Flux</p><p className="text-3xl font-[1000] italic tracking-tighter">{financeStats.ca.toFixed(2)}€</p></div>
                </div>
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-6 text-blue-600">
                  <div className="bg-[#111111] text-white p-4 rounded-2xl"><Layers size={24} /></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase">En attente</p><p className="text-3xl font-[1000] italic tracking-tighter">{orders.length} COLIS</p></div>
                </div>
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-6">
                  <div className="bg-green-100 text-green-600 p-4 rounded-2xl"><ShoppingCart size={24} /></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase">Ventes Jour</p><p className="text-3xl font-[1000] italic tracking-tighter">{todaySales}</p></div>
                </div>
              </div>
            )}

            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input type="text" placeholder="TROUVER NOM, REF, IMEI..." className="w-full bg-white px-16 py-6 rounded-[2rem] text-xs font-bold uppercase outline-none border border-gray-100 focus:ring-4 ring-blue-500/10 text-[#111111]" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#111111] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="p-8 w-10 text-center"><input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} className="accent-blue-600" /></th>
                    <th className="p-8">Commande</th>
                    <th className="p-8">Destinataire</th>
                    <th className="p-8">Transport API</th>
                    <th className="p-8 text-center">Items</th>
                    <th className="p-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.filter(o => o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || o.orderNumber?.includes(searchTerm)).map((order) => (
                    <tr key={order._id} className={`group hover:bg-gray-50/50 transition-all ${selectedIds.includes(order._id) ? 'bg-blue-50/40' : ''}`}>
                      <td className="p-8 text-center"><input type="checkbox" checked={selectedIds.includes(order._id)} onChange={() => toggleSelect(order._id)} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" /></td>
                      <td className="p-8">
                        <div className="font-[1000] text-sm uppercase italic tracking-tighter text-[#111111]">#{order.orderNumber}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">{new Date(order._createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-8">
                        <div className="font-bold text-xs uppercase text-[#111111]">{order.customer?.name}</div>
                        <div className="text-[10px] text-gray-400">{order.customer?.city || "France"}</div>
                      </td>
                      <td className="p-8">
                         <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-blue-600 uppercase italic">Colissimo API</span>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                               <span className="text-[10px] font-bold uppercase opacity-40">Ready to ship</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-8 text-center">
                        {order.items?.map((item: OrderItem, idx: number) => (
                          <div key={idx} className="flex flex-col items-center mb-1">
                            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">{item.productName}</span>
                            {item.currentStock <= 2 && (
                              <div className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-red-50 rounded-md border border-red-100">
                                <Activity size={10} className="text-red-500 animate-pulse" />
                                <span className="text-[7px] font-black text-red-600 uppercase italic">Stock : {item.currentStock}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="p-8 text-right flex justify-end gap-2">
                        <button onClick={() => generateInvoice(order)} className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"><Download size={18} /></button>
                        
                        {activeTab === "flux" ? (
                          <button onClick={() => setSelectedOrder(order)} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><Package size={18} /></button>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                if(confirm("Remettre cette commande en préparation ?")) {
                                  const res = await resetOrderAction(order._id, order.items);
                                  if(res.success) {
                                    await notifySAV(order, "RE-PREP");
                                    fetchOrders();
                                  }
                                }
                              }} 
                              className="p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                            ><RefreshCcw size={18} /></button>
                            <button 
                              onClick={async () => {
                                if(confirm("Annuler définitivement cette commande ?")) {
                                  const res = await cancelOrderAction(order._id);
                                  if(res.success) {
                                    await notifySAV(order, "CANCEL"); 
                                    fetchOrders();
                                  }
                                }
                              }} 
                              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            ><Trash2 size={18} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* --- MODAL DE SCAN PLEIN ÉCRAN (IMEI + TRACKING) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm text-[#111111]">
              <div className="flex items-center gap-3">
                 <div className="bg-blue-600 text-white p-2 rounded-lg"><Package size={16}/></div>
                 <h2 className="text-xl font-[1000] uppercase italic tracking-tighter">SCAN #{selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F5F5F7]">
            <div className="max-w-3xl mx-auto py-12 px-6 pb-40">
              <div className="bg-[#111111] text-white p-8 rounded-[3rem] mb-12 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1 italic">Client :</p>
                  <p className="text-xl font-black uppercase italic tracking-tighter">{selectedOrder.customer?.name}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black uppercase opacity-50">Items</p>
                  <p className="text-2xl font-black italic">{selectedOrder.items?.length || 0}</p>
                </div>
              </div>

              <div className="space-y-8">
                {selectedOrder.items?.map((item: OrderItem, i: number) => {
                  const currentImei = itemsImei[`${selectedOrder._id}-${i}`] || "";
                  const isImeiValid = currentImei.length === 15;

                  return (
                    <div key={i} className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100 relative group">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-4 rounded-2xl shadow-lg transition-all ${isImeiValid ? 'bg-green-600' : 'bg-blue-600'}`}>
                          <Package size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Article {i + 1}</p>
                          <p className="text-lg font-[1000] uppercase italic tracking-tight text-[#111111]">{item.productName}</p>
                          
                          {/* ALERTE STOCK CRITIQUE */}
                          {item.currentStock <= 2 && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-red-50 rounded-lg border border-red-100 w-fit">
                              <Activity size={12} className="text-red-500 animate-pulse" />
                              <span className="text-[9px] font-black text-red-600 uppercase italic">
                                Stock Critique : {item.currentStock} restants
                              </span>
                            </div>
                          )}
                        </div>
                        {isImeiValid && <CheckCircle2 className="text-green-500 animate-in zoom-in" size={24} />}
                      </div>

                      <div className="relative">
                        <input 
                          type="text" autoFocus={i === 0} value={currentImei}
                          placeholder="SCANNER IMEI (15 CHIFFRES)..." 
                          className={`w-full p-8 rounded-[2rem] border-2 outline-none font-mono text-xl font-bold uppercase tracking-[0.2em] transition-all ${isImeiValid ? "border-green-500 bg-green-50/20 shadow-lg shadow-green-100" : "border-transparent bg-gray-50 focus:border-blue-600 focus:bg-white"}`}
                          onChange={(e) => setItemsImei({...itemsImei, [`${selectedOrder._id}-${i}`]: e.target.value})} 
                        />
                        {currentImei && (
                          <button onClick={() => setItemsImei({...itemsImei, [`${selectedOrder._id}-${i}`]: ""})} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X size={24} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                <div className={`bg-white p-10 rounded-[4rem] shadow-2xl border-4 mt-16 transition-all ${trackingNumber.length > 5 ? 'border-green-500' : 'border-green-500/10'}`}>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-green-600 text-white p-5 rounded-[1.5rem] shadow-lg shadow-green-100"><Truck size={28} /></div>
                    <p className="text-xl font-[1000] uppercase italic text-green-950 tracking-tighter">Numéro de Suivi Colis</p>
                  </div>
                  <div className="relative">
                    <input type="text" value={trackingNumber} placeholder="SCAN CODE BARRE..." className={`w-full p-8 rounded-[2rem] border-2 outline-none font-mono text-xl font-bold uppercase transition-all ${trackingNumber.length > 5 ? "border-green-500 bg-green-50/20" : "border-gray-100 bg-green-50/50"}`} onChange={(e) => setTrackingNumber(e.target.value)} />
                    {trackingNumber && (
                      <button onClick={() => setTrackingNumber("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-green-300 hover:text-red-500"><X size={24} /></button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-10">
                  <button onClick={() => setSelectedOrder(null)} className="bg-gray-100 text-gray-400 py-8 rounded-[3rem] font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                    <ChevronLeft size={20} /> Liste
                  </button>
                  <button onClick={handleIndividualShip} disabled={isUpdating || !trackingNumber} className="md:col-span-2 bg-[#111111] text-white py-8 rounded-[3rem] font-[1000] uppercase italic tracking-[0.2em] text-[18px] hover:bg-blue-600 active:scale-95 transition-all shadow-2xl disabled:opacity-10 flex items-center justify-center gap-4">
                    {isUpdating ? <RefreshCcw className="animate-spin" /> : <><CheckCircle2 size={24} /> EXPÉDIER & SUIVANT</>}
                  </button>
                  <button onClick={goToNextOrder} className="bg-blue-50 text-blue-600 py-8 rounded-[3rem] font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    Suivant <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}