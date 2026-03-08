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
  
  // Color palette
  const gold = [192, 155, 68] as const;
  const goldLight = [218, 190, 120] as const;
  const darkBg = [18, 18, 22] as const;
  const darkCard = [28, 28, 34] as const;
  const white = [255, 255, 255] as const;
  const lightGray = [180, 180, 185] as const;
  const medGray = [130, 130, 135] as const;
  const textWhite = [240, 240, 242] as const;

  const pageW = 210;
  const pageH = doc.internal.pageSize.height;
  const marginL = 18;
  const marginR = 192;

  // === FULL PAGE DARK BACKGROUND ===
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, pageH, 'F');

  // === HEADER BAR ===
  doc.setFillColor(...darkCard);
  doc.rect(0, 0, pageW, 52, 'F');

  // Gold accent line at top
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 2, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...gold);
  doc.text('VELOCITY', marginL, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text('L U X U R Y   S U P E R C A R S', marginL, 36);

  // Invoice title - right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...goldLight);
  doc.text('TAX INVOICE', marginR, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text(order.order_number, marginR, 28, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(...medGray);
  doc.text(
    new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    marginR,
    36,
    { align: 'right' }
  );

  // === GOLD DIVIDER ===
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(marginL, 56, marginR, 56);

  // === BILL TO / SHIP TO SECTION ===
  let y = 66;

  // Section labels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('B I L L   T O', marginL, y);
  doc.text('S H I P   T O', 115, y);

  // Subtle divider line between sections
  doc.setDrawColor(50, 50, 55);
  doc.setLineWidth(0.3);
  doc.line(105, y - 4, 105, y + 30);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...textWhite);
  doc.text(order.shipping_name, marginL, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_email, marginL, y + 7);
  doc.text(order.shipping_phone, marginL, y + 14);

  // Ship to details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_address, 115, y);
  doc.text(`${order.shipping_city}, ${order.shipping_state}`, 115, y + 7);
  doc.text(`PIN: ${order.shipping_pincode}`, 115, y + 14);

  // === PAYMENT BADGE ===
  y += 28;
  doc.setFillColor(...darkCard);
  doc.roundedRect(marginL, y, 60, 12, 3, 3, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginL, y, 60, 12, 3, 3, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('PAYMENT', marginL + 5, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textWhite);
  doc.text(order.payment_method.toUpperCase(), marginL + 28, y + 7.5);

  // === ITEMS TABLE ===
  y += 22;
  const tableData = items.map((item, idx) => {
    const name = item.car?.name || item.car_name || '';
    const brand = item.car?.brand || item.car_brand || '';
    const price = item.car?.price || item.price || 0;
    return [
      (idx + 1).toString().padStart(2, '0'),
      name,
      brand,
      item.quantity.toString(),
      formatPrice(price),
      formatPrice(price * item.quantity),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['#', 'Vehicle', 'Manufacturer', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 6, bottom: 6, left: 5, right: 5 },
    },
    headStyles: {
      fillColor: [35, 35, 42],
      textColor: [...gold],
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: { top: 7, bottom: 7, left: 5, right: 5 },
    },
    bodyStyles: {
      textColor: [...textWhite],
      lineColor: [40, 40, 48],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [24, 24, 30],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12, textColor: [...medGray] },
      1: { fontStyle: 'bold', cellWidth: 50 },
      2: { cellWidth: 35 },
      3: { halign: 'center', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 32 },
      5: { halign: 'right', cellWidth: 32, fontStyle: 'bold', textColor: [...goldLight] },
    },
    margin: { left: marginL, right: pageW - marginR },
    tableLineColor: [40, 40, 48],
    tableLineWidth: 0.2,
  });

  // === TOTALS SECTION ===
  const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
  let totY = finalY + 14;

  // Totals background card
  const totalsHeight = order.discount > 0 ? 58 : 48;
  doc.setFillColor(...darkCard);
  doc.roundedRect(120, totY - 8, 72, totalsHeight, 4, 4, 'F');
  doc.setDrawColor(50, 50, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(120, totY - 8, 72, totalsHeight, 4, 4, 'S');

  const drawRow = (label: string, value: string, isGold = false, isBold = false) => {
    doc.setFontSize(isBold ? 11 : 8.5);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (isGold) {
      doc.setTextColor(...gold);
    } else if (isBold) {
      doc.setTextColor(...textWhite);
    } else {
      doc.setTextColor(...lightGray);
    }
    
    doc.text(label, 126, totY);
    
    if (isBold) {
      doc.setTextColor(...gold);
    } else if (isGold) {
      doc.setTextColor(...goldLight);
    }
    
    doc.text(value, 186, totY, { align: 'right' });
    totY += isBold ? 0 : 9;
  };

  drawRow('Subtotal', formatPrice(order.subtotal));
  drawRow('GST (28%)', formatPrice(order.gst_amount), true);
  if (order.discount > 0) {
    drawRow('Discount', `- ${formatPrice(order.discount)}`);
  }

  // Separator inside totals card
  totY += 2;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(126, totY - 4, 186, totY - 4);
  totY += 4;
  
  drawRow('GRAND TOTAL', formatPrice(order.total), false, true);

  // === FOOTER ===
  // Gold line above footer
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(marginL, pageH - 38, marginR, pageH - 38);

  // Footer dark card
  doc.setFillColor(...darkCard);
  doc.rect(0, pageH - 35, pageW, 35, 'F');

  // Footer content
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', pageW / 2, pageH - 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text('GSTIN: 27AADCV1234A1ZB  •  CIN: U34100MH2024PTC123456', pageW / 2, pageH - 20, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010  •  +91 98765 43210', pageW / 2, pageH - 15, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...goldLight);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', pageW / 2, pageH - 8, { align: 'center' });

  doc.save(`Velocity-Invoice-${order.order_number}.pdf`);
};
