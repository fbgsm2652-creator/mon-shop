import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { items, customer, total } = await request.json();

    // 1. Récupération des clés API dynamiquement depuis Sanity
    const settings = await client.fetch(`*[_type == "settings"][0]`);
    
    if (!settings?.zenTerminalId || !settings?.zenSecretKey) {
      return NextResponse.json({ error: "Configuration ZEN manquante dans Sanity" }, { status: 500 });
    }

    // 2. Préparation du body pour ZEN.com
    const zenPayload = {
      terminalId: settings.zenTerminalId,
      amount: total,
      currency: "EUR",
      orderId: `RENW-${Date.now()}`, // ID unique pour ton suivi
      customer: {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone
      },
      items: items.map((item: any) => ({
        name: `${item.name} (${item.capacity})`,
        price: item.price,
        quantity: 1
      })),
      // URL de retour après paiement
      redirectSuccessUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      redirectFailureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
    };

    // 3. Appel à l'API ZEN.com
    const response = await fetch(settings.zenMode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.zenSecretKey}`
      },
      body: JSON.stringify(zenPayload)
    });

    const zenData = await response.json();

    // On renvoie l'URL de redirection au frontend
    return NextResponse.json({ redirectUrl: zenData.redirectUrl });

  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'initialisation du paiement" }, { status: 500 });
  }
}