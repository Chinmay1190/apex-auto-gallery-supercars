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

type RGB = [number, number, number];

const palette = {
  gold: [192, 155, 68] as RGB,
  goldSoft: [218, 190, 120] as RGB,
  darkBg: [14, 14, 18] as RGB,
  darkCard: [24, 24, 30] as RGB,
  darkCard2: [32, 32, 40] as RGB,
  text: [245, 245, 247] as RGB,
  textMuted: [175, 175, 182] as RGB,
  textSoft: [120, 120, 128] as RGB,
  stroke: [46, 46, 56] as RGB,
};

const PAGE_W = 210;
const MARGIN_L = 16;
const MARGIN_R = 194;

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const cleanText = (value: unknown, fallback = '-'): string => {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : fallback;
};

const fmtPrice = (value: unknown): string => {
  const amount = toNumber(value);
  return `INR ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const fmtDate = (value: unknown): string => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  if (typeof value === 'number' && value > 1 && value < 100000) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  const date = new Date(String(value ?? ''));
  if (Number.isNaN(date.getTime())) return cleanText(value, 'N/A');
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

const addPageBackground = (doc: jsPDF) => {
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(...palette.darkBg);
  doc.rect(0, 0, PAGE_W, pageH, 'F');

  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(1.2);
  doc.line(0, 8, 18, 8);
  doc.line(8, 0, 8, 18);
  doc.line(PAGE_W - 18, 8, PAGE_W, 8);
  doc.line(PAGE_W - 8, 0, PAGE_W - 8, 18);
};

const drawHeader = (doc: jsPDF, order: InvoiceOrder) => {
  doc.setFillColor(...palette.gold);
  doc.rect(0, 0, PAGE_W, 2.5, 'F');
  doc.setFillColor(142, 112, 46);
  doc.rect(0, 2.5, PAGE_W, 1, 'F');

  doc.setFillColor(...palette.darkCard);
  doc.rect(0, 3.5, PAGE_W, 42, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...palette.gold);
  doc.text('VELOCITY', MARGIN_L, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...palette.textSoft);
  doc.text('LUXURY SUPERCARS INDIA', MARGIN_L, 31);

  doc.setFillColor(...palette.darkCard2);
  doc.roundedRect(PAGE_W - 74, 10, 58, 26, 3, 3, 'F');
  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(PAGE_W - 74, 10, 58, 26, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...palette.gold);
  doc.text('TAX INVOICE', PAGE_W - 45, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...palette.goldSoft);
  doc.text(cleanText(order.order_number, 'N/A'), PAGE_W - 45, 24, { align: 'center' });

  doc.setTextColor(...palette.textSoft);
  doc.text(fmtDate(order.created_at), PAGE_W - 45, 30, { align: 'center' });

  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_L, 49, PAGE_W / 2 - 6, 49);
  doc.line(PAGE_W / 2 + 6, 49, MARGIN_R, 49);

  doc.setFillColor(...palette.gold);
  const midX = PAGE_W / 2;
  doc.triangle(midX, 46.8, midX + 2.2, 49, midX, 51.2, 'F');
  doc.triangle(midX, 46.8, midX - 2.2, 49, midX, 51.2, 'F');
};

const drawLabeledCard = (
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  lines: string[]
) => {
  doc.setFillColor(...palette.darkCard);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  doc.setDrawColor(...palette.stroke);
  doc.setLineWidth(0.35);
  doc.roundedRect(x, y, w, h, 3, 3, 'S');

  doc.setFillColor(...palette.gold);
  doc.rect(x, y + 3, 2, h - 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...palette.gold);
  doc.text(label, x + 7, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...palette.textMuted);

  let lineY = y + 12;
  lines.forEach((line, i) => {
    const wrapped = doc.splitTextToSize(line || '-', w - 12);
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.setTextColor(...(i === 0 ? palette.text : palette.textMuted));
    wrapped.slice(0, 2).forEach((segment: string) => {
      doc.text(segment, x + 7, lineY);
      lineY += 6;
    });
  });
};

const drawCustomerSection = (doc: jsPDF, order: InvoiceOrder) => {
  const y = 56;

  drawLabeledCard(doc, MARGIN_L, y, 84, 46, 'BILL TO', [
    order.shipping_name,
    order.shipping_email,
    order.shipping_phone,
  ]);

  drawLabeledCard(doc, 110, y, 84, 46, 'SHIP TO', [
    order.shipping_address,
    `${order.shipping_city}, ${order.shipping_state}`,
    `PIN: ${order.shipping_pincode}`,
  ]);

  const payY = y + 52;
  doc.setFillColor(...palette.darkCard2);
  doc.roundedRect(MARGIN_L, payY, 70, 13, 3, 3, 'F');
  doc.setDrawColor(...palette.gold);
  doc.roundedRect(MARGIN_L, payY, 70, 13, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...palette.textSoft);
  doc.text('PAYMENT', MARGIN_L + 8, payY + 8);

  doc.setFontSize(8);
  doc.setTextColor(...palette.text);
  doc.text((order.payment_method || 'N/A').toUpperCase(), MARGIN_L + 30, payY + 8);

  return payY + 20;
};

const drawItemsTable = (doc: jsPDF, startY: number, items: InvoiceItem[]) => {
  const rows = (items.length ? items : [{ quantity: 1 } as InvoiceItem]).map((item, index) => {
    const rawName = cleanText(item.car?.name || item.car_name || 'Vehicle');
    const brand = cleanText(item.car?.brand || item.car_brand || '-');
    const name = rawName.toLowerCase().startsWith(brand.toLowerCase()) ? rawName : `${brand} ${rawName}`.trim();

    const unit = toNumber(item.car?.price ?? item.price);
    const qty = Math.max(1, Math.floor(toNumber(item.quantity)));
    const amount = unit * qty;

    return [
      String(index + 1).padStart(2, '0'),
      cleanText(name).toUpperCase(),
      brand,
      String(qty),
      fmtPrice(unit),
      fmtPrice(amount),
    ];
  });

  autoTable(doc, {
    startY,
    head: [['NO.', 'VEHICLE', 'MAKE', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: rows,
    theme: 'plain',
    margin: { left: MARGIN_L, right: PAGE_W - MARGIN_R },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: [...palette.text],
      cellPadding: { top: 6.5, right: 5, bottom: 6.5, left: 5 },
      lineColor: [...palette.stroke],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [...palette.darkCard2],
      textColor: [...palette.gold],
      fontStyle: 'bold',
      fontSize: 6.5,
      cellPadding: { top: 7.5, right: 5, bottom: 7.5, left: 5 },
    },
    alternateRowStyles: {
      fillColor: [20, 20, 26],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14, textColor: [...palette.goldSoft], fontStyle: 'bold' },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 30, textColor: [...palette.textMuted] },
      3: { halign: 'center', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 34 },
      5: { halign: 'right', cellWidth: 34, textColor: [...palette.goldSoft], fontStyle: 'bold' },
    },
    didDrawPage: () => {
      addPageBackground(doc);
    },
  });

  return (doc as any).lastAutoTable?.finalY || startY + 20;
};

const drawTotalsCard = (doc: jsPDF, order: InvoiceOrder, startY: number) => {
  const pageH = doc.internal.pageSize.height;
  const footerH = 34;
  const neededH = order.discount > 0 ? 76 : 68;

  let y = startY;
  if (y + neededH + footerH > pageH - 10) {
    doc.addPage();
    addPageBackground(doc);
    y = 24;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...palette.textSoft);
  doc.text('* Prices are in Indian Rupees (INR)', MARGIN_L, y + 4);
  doc.text('* GST charged at 28% as applicable', MARGIN_L, y + 10);

  const cardX = 114;
  const cardW = 80;
  const cardH = order.discount > 0 ? 58 : 50;

  doc.setFillColor(...palette.darkCard);
  doc.roundedRect(cardX, y - 2, cardW, cardH, 4, 4, 'F');
  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(cardX, y - 2, cardW, cardH, 4, 4, 'S');

  doc.setFillColor(...palette.gold);
  doc.rect(cardX + 4, y - 2, cardW - 8, 1.8, 'F');

  let tY = y + 8;
  const drawRow = (label: string, value: string, opts?: { bold?: boolean; accent?: boolean }) => {
    const bold = opts?.bold || false;
    const accent = opts?.accent || false;

    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 11 : 8);

    doc.setTextColor(...(bold ? palette.text : accent ? palette.gold : palette.textMuted));
    doc.text(label, cardX + 8, tY);

    doc.setTextColor(...(bold ? palette.gold : accent ? palette.goldSoft : palette.text));
    doc.text(value, cardX + cardW - 8, tY, { align: 'right' });

    tY += bold ? 0 : 9;
  };

  drawRow('Subtotal', fmtPrice(toNumber(order.subtotal)));
  drawRow('GST (28%)', fmtPrice(toNumber(order.gst_amount)), { accent: true });
  if (toNumber(order.discount) > 0) {
    drawRow('Discount', `- ${fmtPrice(toNumber(order.discount))}`);
  }

  tY += 1;
  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(0.5);
  doc.line(cardX + 8, tY, cardX + cardW - 8, tY);
  tY += 6;

  drawRow('GRAND TOTAL', fmtPrice(toNumber(order.total)), { bold: true });
};

const drawFooter = (doc: jsPDF) => {
  const pageH = doc.internal.pageSize.height;

  doc.setFillColor(...palette.darkCard);
  doc.rect(0, pageH - 34, PAGE_W, 34, 'F');

  doc.setFillColor(...palette.gold);
  doc.rect(0, pageH - 34, PAGE_W, 1.4, 'F');

  doc.setDrawColor(...palette.gold);
  doc.setLineWidth(1.2);
  doc.line(0, pageH - 8, 18, pageH - 8);
  doc.line(8, pageH - 18, 8, pageH);
  doc.line(PAGE_W - 18, pageH - 8, PAGE_W, pageH - 8);
  doc.line(PAGE_W - 8, pageH - 18, PAGE_W - 8, pageH);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...palette.gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', PAGE_W / 2, pageH - 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...palette.textSoft);
  doc.text('GSTIN: 27AADCV1234A1ZB  |  CIN: U34100MH2024PTC123456', PAGE_W / 2, pageH - 16, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010  |  +91 98765 43210  |  info@velocity.in', PAGE_W / 2, pageH - 11, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...palette.goldSoft);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', PAGE_W / 2, pageH - 5.5, { align: 'center' });
};

export const generateInvoicePDF = (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  addPageBackground(doc);
  drawHeader(doc, order);

  const tableStartY = drawCustomerSection(doc, order);
  const tableFinalY = drawItemsTable(doc, tableStartY, items);

  drawTotalsCard(doc, order, tableFinalY + 8);
  drawFooter(doc);

  doc.save(`Velocity-Invoice-${order.order_number}.pdf`);
};
