"use server";

import { createClient } from "next-sanity";

// On initialise Sanity de manière ultra sécurisée (côté serveur uniquement)
const writeClient = createClient({
  projectId: 'dhd0ohjg',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

export async function createOrderAction(orderData: any, customerData: any, userId?: string | null) {
  try {
    // 1. Si l'utilisateur est connecté (ID Clerk présent), on gère son profil
    if (userId && userId !== "guest") {
      const existingCustomer = await writeClient.fetch(
        `*[_type == "customer" && clerkId == $userId][0]`,
        { userId }
      );

      if (!existingCustomer) {
        await writeClient.create({
          _type: 'customer',
          clerkId: userId,
          email: customerData.email,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
        });
      }
    }

    // 2. Création de la commande dans la base de données
    const createdOrder = await writeClient.create(orderData);
    
    // On force la conversion de l'ID en string pour éviter les erreurs de sérialisation
    return { success: true, orderId: String(createdOrder._id) };

  } catch (error) {
    console.error("Erreur critique création commande Sanity:", error);
    return { success: false, error: "Impossible de créer la commande côté serveur." };
  }
}