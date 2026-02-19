"use server";
import { client } from "@/sanity/lib/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addAddress(formData: FormData) {
  // 1. Authentification sécurisée
  const { userId } = await auth();
  const user = await currentUser(); 
  
  if (!userId || !user) throw new Error("Accès refusé : Veuillez vous connecter.");

  // 2. Extraction et validation rapide des données
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;

  if (!street || !city || !zipCode) {
    throw new Error("Veuillez remplir tous les champs obligatoires.");
  }

  // 3. Objet adresse avec clé conforme Sanity
  // Note : On utilise un timestamp + random pour une clé unique et stable
  const newAddress = {
    _key: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    street,
    city,
    zipCode,
    country: "France",
    isDefault: false
  };

  try {
    // 4. Vérification de l'existence du client (Crawl interne Sanity)
    const customer = await client.fetch(
      `*[_type == "customer" && clerkId == $userId][0]`, 
      { userId }
    );

    if (!customer) {
      // CRÉATION PROFIL : Liaison Clerk -> Sanity
      await client.create({
        _type: "customer",
        clerkId: userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        addresses: [{ ...newAddress, isDefault: true }] // La première est par défaut
      });
    } else {
      // MISE À JOUR : Ajout par patch atomique
      await client
        .patch(customer._id)
        .setIfMissing({ addresses: [] })
        .append("addresses", [newAddress])
        .commit();
    }

    // 5. Mise à jour du cache pour l'utilisateur
    revalidatePath("/mon-compte/adresses");
    revalidatePath("/checkout/shipping"); // On revalide aussi le tunnel d'achat !
    
    return { success: true };
  } catch (error) {
    console.error("Erreur Sanity Address:", error);
    throw new Error("Impossible d'enregistrer l'adresse.");
  }
}