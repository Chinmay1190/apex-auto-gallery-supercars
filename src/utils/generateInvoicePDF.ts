import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from '@/data/cars';

interface InvoiceOrder {
  order_number: string;
  created_at: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  payment_method: string;
  subtotal: number;
  gst_amount: number;
  discount: number;
  total: number;
}

interface InvoiceItem {
  car_name?: string;
  car_brand?: string;
  car?: { name: string; brand: string; price: number };
  price?: number;
  quantity: number;
}

export const generateInvoicePDF = (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF();
  const gold = [200, 164, 90] as const;
  const dark = [26, 26, 26] as const;
  const gray = [120, 120, 120] as const;

  // Header
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...gold);
  doc.text('VELOCITY', 20, 25);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('LUXURY SUPERCARS', 20, 33);
  
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', 190, 20, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(order.order_number, 190, 28, { align: 'right' });
  doc.text(new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), 190, 35, { align: 'right' });

  // Gold line
  doc.setDrawColor(...gold);
  doc.setLineWidth(1);
  doc.line(20, 47, 190, 47);

  // Bill To / Ship To
  let y = 56;
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.text('BILL TO', 20, y);
  doc.text('SHIP TO', 115, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.text(order.shipping_name, 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(order.shipping_email, 20, y + 6);
  doc.text(order.shipping_phone, 20, y + 12);

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(order.shipping_address, 115, y);
  doc.text(`${order.shipping_city}, ${order.shipping_state}`, 115, y + 6);
  doc.text(`PIN: ${order.shipping_pincode}`, 115, y + 12);

  // Payment badge
  y += 24;
  doc.setFillColor(248, 246, 240);
  doc.roundedRect(20, y, 55, 10, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text(`Payment: ${order.payment_method.toUpperCase()}`, 25, y + 7);

  // Table
  y += 18;
  const tableData = items.map(item => {
    const name = item.car?.name || item.car_name || '';
    const brand = item.car?.brand || item.car_brand || '';
    const price = item.car?.price || item.price || 0;
    return [name, brand, item.quantity.toString(), formatPrice(price), formatPrice(price * item.quantity)];
  });

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Brand', 'Qty', 'Price', 'Total']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [248, 246, 240],
      textColor: [100, 100, 100],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50],
      cellPadding: 5,
    },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
  let totY = finalY + 10;
  
  const drawTotalRow = (label: string, value: string, isGold = false, isBold = false) => {
    doc.setFontSize(isBold ? 12 : 9);
    doc.setTextColor(isGold ? gold[0] : (isBold ? dark[0] : gray[0]), isGold ? gold[1] : (isBold ? dark[1] : gray[1]), isGold ? gold[2] : (isBold ? dark[2] : gray[2]));
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, 130, totY);
    doc.text(value, 190, totY, { align: 'right' });
    totY += isBold ? 10 : 7;
  };

  drawTotalRow('Subtotal', formatPrice(order.subtotal));
  drawTotalRow('GST (28%)', formatPrice(order.gst_amount), true);
  if (order.discount > 0) drawTotalRow('Discount', `-${formatPrice(order.discount)}`);
  
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(130, totY - 2, 190, totY - 2);
  totY += 4;
  drawTotalRow('Grand Total', formatPrice(order.total), false, true);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(232, 224, 204);
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 30, 190, pageHeight - 30);
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('GSTIN: 27AADCV1234A1ZB  |  Velocity Supercars Pvt. Ltd.', 105, pageHeight - 22, { align: 'center' });
  doc.text('Worli Sea Face Road, Mumbai, Maharashtra 400018', 105, pageHeight - 17, { align: 'center' });
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', 105, pageHeight - 12, { align: 'center' });

  doc.save(`Velocity-Invoice-${order.order_number}.pdf`);
};
