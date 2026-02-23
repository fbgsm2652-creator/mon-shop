import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const data = await resend.emails.send({
      // 🚨 IMPORTANT 1 : Ton adresse vérifiée sur Resend
      from: 'RENW Contact <contact@renw.fr>', 
      
      // 🚨 IMPORTANT 2 : La boîte mail où tu veux lire les messages
      to: ['ton-email-pro@renw.fr'], 
      
      subject: `Nouvelle demande depuis le site : ${subject}`,
      
      // 👇 VOICI LA CORRECTION : replyTo au lieu de reply_to
      replyTo: email, 
      
      html: `
        <div style="font-family: Arial, sans-serif; color: #111111; max-width: 600px; padding: 20px; border: 1px solid #E5F0FF; border-radius: 10px;">
          <h2 style="color: #0066CC; margin-top: 0; border-bottom: 2px solid #F5F5F7; padding-bottom: 10px;">Nouveau message de ${name}</h2>
          <p><strong>Email du client :</strong> <a href="mailto:${email}" style="color: #0066CC;">${email}</a></p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #E5F0FF; margin: 20px 0;" />
          <h3 style="color: #111111; margin-bottom: 10px;">Message :</h3>
          <p style="white-space: pre-wrap; background-color: #F8FBFF; padding: 15px; border-radius: 8px; line-height: 1.6; font-size: 15px;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Erreur d'envoi d'email avec Resend :", error);
    return NextResponse.json({ error: "Échec de l'envoi de l'email" }, { status: 500 });
  }
}