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

const fmt = (price: number): string => {
  return 'INR ' + new Intl.NumberFormat('en-IN').format(price);
};

export const generateInvoicePDF = (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF();

  // Premium color palette
  const gold: [number, number, number] = [192, 155, 68];
  const goldLight: [number, number, number] = [218, 190, 120];
  const goldDark: [number, number, number] = [140, 110, 45];
  const darkBg: [number, number, number] = [14, 14, 18];
  const darkCard: [number, number, number] = [24, 24, 30];
  const darkCard2: [number, number, number] = [32, 32, 40];
  const textWhite: [number, number, number] = [245, 245, 247];
  const lightGray: [number, number, number] = [175, 175, 182];
  const medGray: [number, number, number] = [120, 120, 128];
  const accent: [number, number, number] = [60, 60, 70];

  const pageW = 210;
  const pageH = doc.internal.pageSize.height;
  const mL = 16;
  const mR = 194;

  // === FULL PAGE BG ===
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, pageH, 'F');

  // === DECORATIVE CORNER ELEMENTS ===
  // Top-left corner accent
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.line(0, 8, 20, 8);
  doc.line(8, 0, 8, 20);

  // Top-right corner accent
  doc.line(pageW - 20, 8, pageW, 8);
  doc.line(pageW - 8, 0, pageW - 8, 20);

  // === HEADER SECTION ===
  // Gold gradient bar at very top
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 3, 'F');

  // Darker accent below gold bar
  doc.setFillColor(...goldDark);
  doc.rect(0, 3, pageW, 1, 'F');

  // Header background
  doc.setFillColor(...darkCard);
  doc.rect(0, 4, pageW, 48, 'F');

  // Subtle diagonal decorative line in header
  doc.setDrawColor(40, 40, 48);
  doc.setLineWidth(0.3);
  for (let i = 0; i < 8; i++) {
    doc.line(pageW - 90 + i * 12, 4, pageW - 70 + i * 12, 52);
  }

  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...gold);
  doc.text('VELOCITY', mL + 2, 28);

  // Tagline with decorative dots
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...medGray);
  doc.text('LUXURY  SUPERCARS  INDIA', mL + 2, 36);

  // Small gold diamond icon
  doc.setFillColor(...gold);
  const cx = mL + 2;
  const cy = 42;
  doc.triangle(cx, cy - 2, cx + 2, cy, cx, cy + 2, 'F');
  doc.triangle(cx, cy - 2, cx - 2, cy, cx, cy + 2, 'F');

  // Right side - Invoice badge
  doc.setFillColor(...darkCard2);
  doc.roundedRect(mR - 58, 12, 58, 22, 3, 3, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(mR - 58, 12, 58, 22, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.text('TAX INVOICE', mR - 29, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...goldLight);
  doc.text(order.order_number, mR - 29, 28, { align: 'center' });

  // Date below badge
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text(
    new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    mR - 29, 40, { align: 'center' }
  );

  // === DECORATIVE GOLD DIVIDER WITH DIAMOND ===
  const divY = 56;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(mL, divY, pageW / 2 - 6, divY);
  doc.line(pageW / 2 + 6, divY, mR, divY);

  // Diamond center
  doc.setFillColor(...gold);
  const dY = divY;
  const dX = pageW / 2;
  doc.triangle(dX, dY - 3, dX + 3, dY, dX, dY + 3, 'F');
  doc.triangle(dX, dY - 3, dX - 3, dY, dX, dY + 3, 'F');

  // === BILL TO / SHIP TO ===
  let y = 64;

  // Bill To card
  doc.setFillColor(...darkCard);
  doc.roundedRect(mL, y - 4, 80, 38, 3, 3, 'F');
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.3);
  doc.roundedRect(mL, y - 4, 80, 38, 3, 3, 'S');

  // Gold left border accent on Bill To card
  doc.setFillColor(...gold);
  doc.rect(mL, y - 1, 2, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...gold);
  doc.text('BILL TO', mL + 8, y + 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textWhite);
  doc.text(order.shipping_name, mL + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_email, mL + 8, y + 17);
  doc.text(order.shipping_phone, mL + 8, y + 24);

  // Ship To card
  doc.setFillColor(...darkCard);
  doc.roundedRect(110, y - 4, 84, 38, 3, 3, 'F');
  doc.setDrawColor(...accent);
  doc.roundedRect(110, y - 4, 84, 38, 3, 3, 'S');

  // Gold left border accent on Ship To card
  doc.setFillColor(...gold);
  doc.rect(110, y - 1, 2, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...gold);
  doc.text('SHIP TO', 118, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text(order.shipping_address, 118, y + 10);
  doc.text(order.shipping_city + ', ' + order.shipping_state, 118, y + 17);
  doc.text('PIN: ' + order.shipping_pincode, 118, y + 24);

  // === PAYMENT METHOD BADGE ===
  y += 42;
  doc.setFillColor(...darkCard2);
  doc.roundedRect(mL, y, 65, 14, 3, 3, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.roundedRect(mL, y, 65, 14, 3, 3, 'S');

  // Small gold circle indicator
  doc.setFillColor(...gold);
  doc.circle(mL + 8, y + 7, 2.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(...darkBg);
  doc.text('P', mL + 7, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...medGray);
  doc.text('PAYMENT:', mL + 14, y + 8.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textWhite);
  doc.text(order.payment_method.toUpperCase(), mL + 34, y + 8.5);

  // === ITEMS TABLE ===
  y += 22;
  const tableData = items.map((item, idx) => {
    const name = item.car?.name || item.car_name || '';
    const brand = item.car?.brand || item.car_brand || '';
    const price = item.car?.price || item.price || 0;
    return [
      String(idx + 1).padStart(2, '0'),
      name.toUpperCase(),
      brand,
      String(item.quantity),
      fmt(price),
      fmt(price * item.quantity),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['NO.', 'VEHICLE', 'MAKE', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: { top: 7, bottom: 7, left: 6, right: 6 },
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [35, 35, 44],
      textColor: [...gold],
      fontSize: 6.5,
      fontStyle: 'bold',
      cellPadding: { top: 8, bottom: 8, left: 6, right: 6 },
    },
    bodyStyles: {
      textColor: [...textWhite],
      lineColor: [38, 38, 46],
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [20, 20, 26],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14, textColor: [...goldLight], fontStyle: 'bold' },
      1: { fontStyle: 'bold', cellWidth: 48 },
      2: { cellWidth: 30, textColor: [...lightGray] },
      3: { halign: 'center', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 34 },
      5: { halign: 'right', cellWidth: 34, fontStyle: 'bold', textColor: [...goldLight] },
    },
    margin: { left: mL, right: pageW - mR },
    tableLineColor: [38, 38, 46],
    tableLineWidth: 0.15,
    didDrawPage: () => {
      // Redraw background on new pages
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageW, pageH, 'F');
    }
  });

  // === TOTALS SECTION ===
  const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
  let totY = finalY + 12;

  // Left side note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...medGray);
  doc.text('* All prices are in Indian Rupees (INR)', mL, totY);
  doc.text('* GST charged at 28% as per government norms', mL, totY + 6);

  // Totals card - right side
  const totCardH = order.discount > 0 ? 65 : 55;
  doc.setFillColor(...darkCard);
  doc.roundedRect(115, totY - 6, 79, totCardH, 4, 4, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(115, totY - 6, 79, totCardH, 4, 4, 'S');

  // Gold top accent on totals card
  doc.setFillColor(...gold);
  doc.rect(119, totY - 6, 71, 2, 'F');

  let tY = totY + 4;
  const drawTotalRow = (label: string, value: string, isGold = false, isBold = false) => {
    doc.setFontSize(isBold ? 11 : 8);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    doc.setTextColor(isGold ? ...gold : isBold ? ...textWhite : ...lightGray);
    doc.text(label, 122, tY);

    doc.setTextColor(isBold ? ...gold : isGold ? ...goldLight : ...textWhite);
    doc.text(value, 188, tY, { align: 'right' });
    tY += isBold ? 0 : 9;
  };

  drawTotalRow('Subtotal', fmt(order.subtotal));
  drawTotalRow('GST (28%)', fmt(order.gst_amount), true);
  if (order.discount > 0) {
    drawTotalRow('Discount', '- ' + fmt(order.discount));
  }

  // Separator
  tY += 2;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(122, tY - 3, 188, tY - 3);
  tY += 5;

  drawTotalRow('GRAND TOTAL', fmt(order.total), false, true);

  // === FOOTER ===
  // Decorative bottom corner accents
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.line(0, pageH - 8, 20, pageH - 8);
  doc.line(8, pageH - 20, 8, pageH);
  doc.line(pageW - 20, pageH - 8, pageW, pageH - 8);
  doc.line(pageW - 8, pageH - 20, pageW - 8, pageH);

  // Footer background
  doc.setFillColor(...darkCard);
  doc.rect(0, pageH - 36, pageW, 36, 'F');

  // Gold line above footer
  doc.setFillColor(...gold);
  doc.rect(0, pageH - 36, pageW, 1.5, 'F');

  // Footer diamond
  const fDX = pageW / 2;
  const fDY = pageH - 30;
  doc.setFillColor(...gold);
  doc.triangle(fDX, fDY - 2, fDX + 2, fDY, fDX, fDY + 2, 'F');
  doc.triangle(fDX, fDY - 2, fDX - 2, fDY, fDX, fDY + 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', pageW / 2, pageH - 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...medGray);
  doc.text('GSTIN: 27AADCV1234A1ZB  |  CIN: U34100MH2024PTC123456', pageW / 2, pageH - 16, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010  |  +91 98765 43210  |  info@velocity.in', pageW / 2, pageH - 11, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(...goldLight);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', pageW / 2, pageH - 5, { align: 'center' });

  doc.save('Velocity-Invoice-' + order.order_number + '.pdf');
};
