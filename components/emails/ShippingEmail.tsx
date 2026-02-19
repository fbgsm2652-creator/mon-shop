import * as React from 'react';

export const ShippingEmail = ({ customerName, orderNumber, trackingNumber }: any) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#111' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', textTransform: 'uppercase' }}>
      Votre commande est en route !
    </h1>
    <p>Bonjour {customerName},</p>
    <p>Bonne nouvelle ! Votre commande <strong>#{orderNumber}</strong> vient d'être expédiée.</p>
    <div style={{ background: '#F5F5F7', padding: '20px', borderRadius: '15px', margin: '20px 0' }}>
      <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>Numéro de suivi :</p>
      <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#0066FF' }}>{trackingNumber}</p>
    </div>
    <p>Vous recevrez un autre message lors de la livraison de votre colis.</p>
    <hr style={{ border: 'none', borderTop: '1px solid #EEE', margin: '30px 0' }} />
    <p style={{ fontSize: '10px', color: '#999' }}>RENW - Reconditionnement Premium</p>
  </div>
);