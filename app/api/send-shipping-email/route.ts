import { Resend } from 'resend';
import { ShippingEmail } from '@/components/emails/ShippingEmail';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, orderNumber, trackingNumber } = await req.json();

    // ⚠️ POUR LE TEST : Tu DOIS utiliser 'onboarding@resend.dev'
    // Une fois ton domaine validé dans Resend, tu mettras 'contact@tondomaine.fr'
    const { data, error } = await resend.emails.send({
      from: 'RENW <onboarding@resend.dev>', 
      to: [email], // Rappel: Doit être ton email de compte Resend pour le moment
      subject: `Votre commande #${orderNumber} est en route !`,
      react: ShippingEmail({ customerName, orderNumber, trackingNumber }),
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur Serveur Email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}