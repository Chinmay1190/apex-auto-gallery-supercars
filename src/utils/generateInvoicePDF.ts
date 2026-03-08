import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Format price without ₹ symbol (jsPDF can't render it)
const fmtPrice = (price: number): string => {
  return 'INR ' + price.toLocaleString('en-IN');
};

export const generateInvoicePDF = (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF();

  // Color palette
  const gold: [number, number, number] = [192, 155, 68];
  const goldLight: [number, number, number] = [218, 190, 120];
  const darkBg: [number, number, number] = [18, 18, 22];
  const darkCard: [number, number, number] = [28, 28, 34];
  const textWhite: [number, number, number] = [240, 240, 242];
  const lightGray: [number, number, number] = [180, 180, 185];
  const medGray: [number, number, number] = [130, 130, 135];

  const pageW = 210;
  const pageH = doc.internal.pageSize.height;
  const mL = 18;
  const mR = 192;

  // Full page dark background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Header bar
  doc.setFillColor(...darkCard);
  doc.rect(0, 0, pageW, 52, 'F');

  // Gold accent line at top
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 2.5, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(...gold);
  doc.text('VELOCITY', mL, 27);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text('LUXURY SUPERCARS', mL, 35);

  // Invoice title - right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...goldLight);
  doc.text('TAX INVOICE', mR, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text(order.order_number, mR, 28, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(...medGray);
  doc.text(
    new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    mR, 36, { align: 'right' }
  );

  // Gold divider
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(mL, 56, mR, 56);

  // Bill To / Ship To
  let y = 66;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('BILL TO', mL, y);
  doc.text('SHIP TO', 115, y);

  // Vertical separator
  doc.setDrawColor(50, 50, 55);
  doc.setLineWidth(0.3);
  doc.line(105, y - 4, 105, y + 30);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...textWhite);
  doc.text(order.shipping_name, mL, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_email, mL, y + 7);
  doc.text(order.shipping_phone, mL, y + 14);

  // Ship to details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_address, 115, y);
  doc.text(order.shipping_city + ', ' + order.shipping_state, 115, y + 7);
  doc.text('PIN: ' + order.shipping_pincode, 115, y + 14);

  // Payment badge
  y += 28;
  doc.setFillColor(...darkCard);
  doc.roundedRect(mL, y, 60, 12, 3, 3, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.roundedRect(mL, y, 60, 12, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('PAYMENT', mL + 5, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textWhite);
  doc.text(order.payment_method.toUpperCase(), mL + 28, y + 7.5);

  // Items Table
  y += 22;
  const tableData = items.map((item, idx) => {
    const name = item.car?.name || item.car_name || '';
    const brand = item.car?.brand || item.car_brand || '';
    const price = item.car?.price || item.price || 0;
    return [
      String(idx + 1),
      name,
      brand,
      String(item.quantity),
      fmtPrice(price),
      fmtPrice(price * item.quantity),
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
    margin: { left: mL, right: pageW - mR },
    tableLineColor: [40, 40, 48],
    tableLineWidth: 0.2,
  });

  // Totals Section
  const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
  let totY = finalY + 14;

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

  drawRow('Subtotal', fmtPrice(order.subtotal));
  drawRow('GST (28%)', fmtPrice(order.gst_amount), true);
  if (order.discount > 0) {
    drawRow('Discount', '- ' + fmtPrice(order.discount));
  }

  // Separator inside totals card
  totY += 2;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(126, totY - 4, 186, totY - 4);
  totY += 4;

  drawRow('GRAND TOTAL', fmtPrice(order.total), false, true);

  // Footer
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(mL, pageH - 38, mR, pageH - 38);

  doc.setFillColor(...darkCard);
  doc.rect(0, pageH - 35, pageW, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', pageW / 2, pageH - 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text('GSTIN: 27AADCV1234A1ZB  |  CIN: U34100MH2024PTC123456', pageW / 2, pageH - 20, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010  |  +91 98765 43210', pageW / 2, pageH - 15, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...goldLight);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', pageW / 2, pageH - 8, { align: 'center' });

  doc.save('Velocity-Invoice-' + order.order_number + '.pdf');
};
