import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useInvoice = () => {
  const generateInvoice = (order: any) => {
    try {
      const doc = new jsPDF();
      const settings = order.siteSettings;

      // --- EN-TÊTE : IDENTITÉ VISUELLE ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(17, 17, 17); // Ton Noir #111111
      doc.text(settings?.companyName || "RENW", 15, 20);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`SIRET: ${settings?.siret || "En cours"}`, 15, 26);
      doc.text(settings?.address || "France", 15, 30);
      doc.text(`Email: ${settings?.email || ""} | ${settings?.website || "www.renw.fr"}`, 15, 34);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235); // Ton Bleu #2563EB
      doc.text("FACTURE", 195, 20, { align: "right" });

      // --- INFOS CLIENT & COMMANDE ---
      doc.setDrawColor(240, 240, 240);
      doc.line(15, 40, 195, 40); // Ligne de séparation subtile

      doc.setTextColor(17, 17, 17);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`N° Commande : ${order.orderNumber}`, 15, 50);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Date d'émission : ${new Date(order.orderDate).toLocaleDateString('fr-FR')}`, 15, 55);
      
      doc.setFont("helvetica", "bold");
      doc.text("Destinataire :", 140, 50);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.customer?.name || "Client"}`, 140, 55);
      doc.text(`${order.customer?.address || ""}`, 140, 60, { maxWidth: 55 });

      // --- CONSTRUCTION DU TABLEAU ---
      const items = order.items || [];
      const tableRows = items.map((item: any) => {
        const itemCondition = item.condition || item.grade || null;
        const variantInfo = [
          item.color, 
          item.storage, 
          itemCondition ? `État: ${itemCondition}` : null
        ].filter(Boolean).join(' - ');
        
        const description = `${item.productName}${variantInfo ? '\n' + variantInfo : ''}${item.imei ? '\nIMEI: ' + item.imei : ''}`;

        return [
          description,
          item.quantity || 1,
          `${Number(item.price).toFixed(2)} €`,
          item.vatType === 'margin' ? '0%*' : '20%',
          `${(Number(item.quantity || 1) * Number(item.price)).toFixed(2)} €`
        ];
      });

      autoTable(doc, {
        startY: 75,
        head: [["Description", "Qté", "Prix Unitaire", "TVA", "Total TTC"]],
        body: tableRows,
        theme: "grid",
        headStyles: { 
          fillColor: [17, 17, 17], 
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'center' },
          4: { halign: 'right', fontStyle: 'bold' }
        }
      });

      // --- RÉSUMÉ FINANCIER ---
      const finalY = (doc as any).lastAutoTable?.cursor?.y || 150;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL NET À PAYER : ${Number(order.totalAmount).toFixed(2)} EUR`, 195, finalY + 15, { align: "right" });

      // --- MENTION LÉGALE OBLIGATOIRE (TVA SUR MARGE) ---
      if (items.some((i: any) => i.vatType === 'margin')) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("* Régime particulier - Biens d'occasion - TVA sur marge non récupérable (Art. 297 A du CGI).", 15, finalY + 25);
      }

      // --- PIED DE PAGE ---
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Merci de votre confiance. Pour toute assistance, contactez le support RENW.", 105, 285, { align: "center" });

      doc.save(`Facture-RENW-${order.orderNumber}.pdf`);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
    }
  };

  return { generateInvoice };
};