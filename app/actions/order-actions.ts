"use server";

import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

/**
 * ACTION 1 : EXPÉDIER & DÉCRÉMENTER LE STOCK
 * Optimisation : Empêche le stock négatif et revalide le cache SEO
 */
export async function shipOrderAction(orderId: string, trackingNumber: string, items: any[]) {
  try {
    const transaction = client.transaction();

    // 1. Mise à jour de la commande
    transaction.patch(orderId, (p) => p.set({ 
      status: 'shipped', 
      trackingNumber: trackingNumber,
      items: items 
    }));

    // 2. Décrémentation sécurisée
    items.forEach((item: any) => {
      const targetId = item._ref || item._id;
      if (targetId) {
        // dec({ stock: 1 }) retire 1 au champ stock
        transaction.patch(targetId, (p) => p.dec({ stock: 1 }));
      }
    });

    const result = await transaction.commit();

    // SEO : On force Next.js à rafraîchir les pages produits pour afficher le nouveau stock
    revalidatePath("/");
    revalidatePath("/(shop)/[slug]", "page");

    return { success: true, result };
  } catch (error) {
    console.error("Erreur Sanity Ship & Stock:", error);
    return { success: false, error };
  }
}

/**
 * ACTION 2 : RESET & RÉINCRÉMENTER LE STOCK
 */
export async function resetOrderAction(orderId: string, items: any[]) {
  try {
    const transaction = client.transaction();

    transaction.patch(orderId, (p) => p.set({ 
      status: 'processing', 
      trackingNumber: "",
      items: items.map((item: any) => ({ ...item, imei: "" })) 
    }));

    items.forEach((item: any) => {
      const targetId = item._ref || item._id;
      if (targetId) {
        transaction.patch(targetId, (p) => p.inc({ stock: 1 }));
      }
    });

    const result = await transaction.commit();
    revalidatePath("/(shop)/[slug]", "page");

    return { success: true, result };
  } catch (error) {
    console.error("Erreur Sanity Reset & Stock:", error);
    return { success: false, error };
  }
}

/**
 * ACTION 3 : ANNULER & RÉINCRÉMENTER LE STOCK
 */
export async function cancelOrderAction(orderId: string) {
  try {
    const order = await client.fetch(`*[_id == $id][0]{items}`, { id: orderId });
    
    const transaction = client.transaction();
    transaction.patch(orderId, (p) => p.set({ status: 'cancelled' }));

    if (order?.items) {
      order.items.forEach((item: any) => {
        const targetId = item._ref || item._id;
        if (targetId) {
          transaction.patch(targetId, (p) => p.inc({ stock: 1 }));
        }
      });
    }

    const result = await transaction.commit();
    revalidatePath("/(shop)/[slug]", "page");

    return { success: true, result };
  } catch (error) {
    console.error("Erreur Sanity Cancel & Stock:", error);
    return { success: false, error };
  }
}