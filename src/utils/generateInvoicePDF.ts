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

// ─── Premium Color Palette ───────────────────────────────────
const C = {
  gold:       [192, 155, 68]  as RGB,
  goldLight:  [225, 200, 140] as RGB,
  goldDark:   [140, 110, 45]  as RGB,
  bg:         [10, 10, 14]    as RGB,
  card:       [18, 18, 24]    as RGB,
  cardAlt:    [26, 26, 34]    as RGB,
  surface:    [34, 34, 44]    as RGB,
  white:      [250, 250, 252] as RGB,
  light:      [200, 200, 210] as RGB,
  muted:      [140, 140, 155] as RGB,
  dim:        [90, 90, 105]   as RGB,
  line:       [50, 50, 62]    as RGB,
  tableHead:  [28, 28, 38]    as RGB,
  tableAlt:   [16, 16, 22]    as RGB,
};

const PW = 210;
const ML = 18;
const MR = 192;

// ─── Helpers ─────────────────────────────────────────────────
const num = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') { const n = Number(v.replace(/[^\d.-]/g, '')); return Number.isFinite(n) ? n : 0; }
  return 0;
};

const txt = (v: unknown, fb = '-'): string => { const s = String(v ?? '').trim(); return s || fb; };

const price = (v: unknown): string => {
  const a = num(v);
  return 'INR ' + new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a);
};

const fmtDate = (v: unknown): string => {
  const d = new Date(String(v ?? ''));
  return Number.isNaN(d.getTime()) ? txt(v, 'N/A') : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

// ─── Page Background ─────────────────────────────────────────
const drawBg = (doc: jsPDF) => {
  const pH = doc.internal.pageSize.height;
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, PW, pH, 'F');

  // Subtle geometric corner accents
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.8);
  // top-left
  doc.line(10, 6, 24, 6);
  doc.line(10, 6, 10, 20);
  // top-right
  doc.line(PW - 24, 6, PW - 10, 6);
  doc.line(PW - 10, 6, PW - 10, 20);
  // bottom-left
  doc.line(10, pH - 6, 24, pH - 6);
  doc.line(10, pH - 20, 10, pH - 6);
  // bottom-right
  doc.line(PW - 24, pH - 6, PW - 10, pH - 6);
  doc.line(PW - 10, pH - 20, PW - 10, pH - 6);
};

// ─── Header ──────────────────────────────────────────────────
const drawHeader = (doc: jsPDF, order: InvoiceOrder) => {
  // Gold top strip
  doc.setFillColor(...C.gold);
  doc.rect(0, 0, PW, 3, 'F');
  doc.setFillColor(...C.goldDark);
  doc.rect(0, 3, PW, 0.8, 'F');

  // Header card
  doc.setFillColor(...C.card);
  doc.rect(0, 3.8, PW, 50, 'F');

  // Decorative diagonal lines in header
  doc.setDrawColor(30, 30, 40);
  doc.setLineWidth(0.2);
  for (let i = 0; i < 12; i++) {
    doc.line(PW - 100 + i * 10, 3.8, PW - 85 + i * 10, 53.8);
  }

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...C.gold);
  doc.text('VELOCITY', ML, 28);

  // Subtitle with spaced letters
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.dim);
  doc.text('L U X U R Y   S U P E R C A R S   I N D I A', ML, 36);

  // Small gold bar under brand
  doc.setFillColor(...C.gold);
  doc.rect(ML, 39, 30, 1.2, 'F');

  // Invoice badge - right side
  doc.setFillColor(...C.surface);
  doc.roundedRect(MR - 62, 11, 62, 34, 4, 4, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.6);
  doc.roundedRect(MR - 62, 11, 62, 34, 4, 4, 'S');

  // Small gold diamond inside badge
  const bx = MR - 31;
  doc.setFillColor(...C.gold);
  doc.triangle(bx, 15, bx + 2, 17, bx, 19, 'F');
  doc.triangle(bx, 15, bx - 2, 17, bx, 19, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.gold);
  doc.text('TAX INVOICE', bx, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.goldLight);
  doc.text(txt(order.order_number, 'N/A'), bx, 32, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.text(fmtDate(order.created_at), bx, 38, { align: 'center' });

  // Divider with centered diamond
  const dy = 58;
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.4);
  doc.line(ML, dy, PW / 2 - 5, dy);
  doc.line(PW / 2 + 5, dy, MR, dy);
  doc.setFillColor(...C.gold);
  const mx = PW / 2;
  doc.triangle(mx, dy - 2.5, mx + 2.5, dy, mx, dy + 2.5, 'F');
  doc.triangle(mx, dy - 2.5, mx - 2.5, dy, mx, dy + 2.5, 'F');
};

// ─── Info Card ───────────────────────────────────────────────
const drawInfoCard = (doc: jsPDF, x: number, y: number, w: number, label: string, lines: { text: string; bold?: boolean }[]) => {
  const h = 48;
  // Card bg
  doc.setFillColor(...C.card);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, 3, 3, 'S');

  // Gold left accent
  doc.setFillColor(...C.gold);
  doc.roundedRect(x, y + 4, 2.5, h - 8, 1, 1, 'F');

  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...C.gold);
  doc.text(label, x + 9, y + 8);

  // Gold underline for label
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(x + 9, y + 9.5, x + 9 + doc.getTextWidth(label), y + 9.5);

  // Content lines
  let ly = y + 16;
  lines.forEach((line) => {
    doc.setFont('helvetica', line.bold ? 'bold' : 'normal');
    doc.setFontSize(line.bold ? 9 : 7.5);
    doc.setTextColor(...(line.bold ? C.white : C.light));
    const wrapped = doc.splitTextToSize(txt(line.text), w - 14);
    wrapped.slice(0, 2).forEach((seg: string) => {
      doc.text(seg, x + 9, ly);
      ly += line.bold ? 6.5 : 5.5;
    });
  });
};

// ─── Customer Section ────────────────────────────────────────
const drawCustomerSection = (doc: jsPDF, order: InvoiceOrder): number => {
  const y = 64;
  const halfW = (MR - ML - 6) / 2;

  drawInfoCard(doc, ML, y, halfW, 'BILL TO', [
    { text: order.shipping_name, bold: true },
    { text: order.shipping_email },
    { text: order.shipping_phone },
  ]);

  drawInfoCard(doc, ML + halfW + 6, y, halfW, 'SHIP TO', [
    { text: order.shipping_address, bold: true },
    { text: `${order.shipping_city}, ${order.shipping_state}` },
    { text: `PIN: ${order.shipping_pincode}` },
  ]);

  // Payment method pill
  const py = y + 54;
  doc.setFillColor(...C.cardAlt);
  doc.roundedRect(ML, py, 80, 14, 7, 7, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.35);
  doc.roundedRect(ML, py, 80, 14, 7, 7, 'S');

  // Gold circle with P
  doc.setFillColor(...C.gold);
  doc.circle(ML + 10, py + 7, 3.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...C.bg);
  doc.text('P', ML + 9, py + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...C.muted);
  doc.text('PAYMENT', ML + 18, py + 6);
  doc.setFontSize(8);
  doc.setTextColor(...C.white);
  doc.text(txt(order.payment_method, 'N/A').toUpperCase(), ML + 18, py + 12);

  return py + 22;
};

// ─── Items Table ─────────────────────────────────────────────
const drawItemsTable = (doc: jsPDF, startY: number, items: InvoiceItem[]): number => {
  const safeItems = items.length ? items : [{ quantity: 1 } as InvoiceItem];

  const rows = safeItems.map((item, i) => {
    const rawName = txt(item.car?.name || item.car_name, 'Vehicle');
    const brand = txt(item.car?.brand || item.car_brand, '-');
    const displayName = rawName.toLowerCase().startsWith(brand.toLowerCase()) ? rawName : `${brand} ${rawName}`.trim();
    const unit = num(item.car?.price ?? item.price);
    const qty = Math.max(1, Math.floor(num(item.quantity)));

    return [
      String(i + 1).padStart(2, '0'),
      txt(displayName).toUpperCase(),
      brand,
      String(qty),
      price(unit),
      price(unit * qty),
    ];
  });

  autoTable(doc, {
    startY,
    head: [['#', 'VEHICLE', 'MAKE', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: rows,
    theme: 'plain',
    margin: { left: ML, right: PW - MR },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: [...C.light],
      cellPadding: { top: 7, right: 6, bottom: 7, left: 6 },
      lineColor: [...C.line],
      lineWidth: 0.15,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [...C.tableHead],
      textColor: [...C.gold],
      fontStyle: 'bold',
      fontSize: 6.5,
      cellPadding: { top: 8, right: 6, bottom: 8, left: 6 },
      lineWidth: 0,
    },
    alternateRowStyles: {
      fillColor: [...C.tableAlt],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12, textColor: [...C.goldLight], fontStyle: 'bold' },
      1: { cellWidth: 50, fontStyle: 'bold', textColor: [...C.white] },
      2: { cellWidth: 28, textColor: [...C.muted], fontStyle: 'italic' },
      3: { halign: 'center', cellWidth: 14, textColor: [...C.light] },
      4: { halign: 'right', cellWidth: 34, textColor: [...C.light] },
      5: { halign: 'right', cellWidth: 36, textColor: [...C.goldLight], fontStyle: 'bold' },
    },
    didDrawPage: () => { drawBg(doc); },
  });

  return (doc as any).lastAutoTable?.finalY || startY + 30;
};

// ─── Totals Section ──────────────────────────────────────────
const drawTotals = (doc: jsPDF, order: InvoiceOrder, startY: number) => {
  const pH = doc.internal.pageSize.height;
  const hasDiscount = num(order.discount) > 0;
  const cardH = hasDiscount ? 64 : 54;
  const footerH = 38;

  let y = startY + 6;
  if (y + cardH + footerH > pH - 12) {
    doc.addPage();
    drawBg(doc);
    y = 28;
  }

  // Notes on left
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.dim);
  doc.text('* All prices in Indian Rupees (INR)', ML, y + 6);
  doc.text('* GST charged at 28% as per govt. norms', ML, y + 12);
  doc.text('* This is a computer-generated invoice', ML, y + 18);

  // Totals card - right side
  const cx = 116;
  const cw = MR - cx;

  doc.setFillColor(...C.card);
  doc.roundedRect(cx, y, cw, cardH, 4, 4, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(cx, y, cw, cardH, 4, 4, 'S');

  // Gold top accent bar
  doc.setFillColor(...C.gold);
  doc.rect(cx + 6, y, cw - 12, 2, 'F');

  let ty = y + 12;
  const row = (label: string, val: string, opts?: { bold?: boolean; accent?: boolean; large?: boolean }) => {
    const bold = opts?.bold || false;
    const accent = opts?.accent || false;
    const large = opts?.large || false;

    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(large ? 12 : 8);

    doc.setTextColor(...(bold ? C.white : accent ? C.gold : C.muted));
    doc.text(label, cx + 10, ty);

    doc.setTextColor(...(bold ? C.gold : accent ? C.goldLight : C.white));
    doc.setFont('helvetica', bold || accent ? 'bold' : 'normal');
    doc.text(val, cx + cw - 10, ty, { align: 'right' });

    ty += large ? 0 : 10;
  };

  row('Subtotal', price(num(order.subtotal)));
  row('GST (28%)', price(num(order.gst_amount)), { accent: true });
  if (hasDiscount) {
    row('Discount', '- ' + price(num(order.discount)));
  }

  // Separator line
  ty += 2;
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(cx + 10, ty, cx + cw - 10, ty);
  ty += 8;

  row('GRAND TOTAL', price(num(order.total)), { bold: true, large: true });
};

// ─── Footer ──────────────────────────────────────────────────
const drawFooter = (doc: jsPDF) => {
  const pH = doc.internal.pageSize.height;

  // Footer bg
  doc.setFillColor(...C.card);
  doc.rect(0, pH - 38, PW, 38, 'F');

  // Gold line on top
  doc.setFillColor(...C.gold);
  doc.rect(0, pH - 38, PW, 1.5, 'F');
  doc.setFillColor(...C.goldDark);
  doc.rect(0, pH - 36.5, PW, 0.5, 'F');

  // Diamond center decoration
  const fx = PW / 2;
  const fy = pH - 32;
  doc.setFillColor(...C.gold);
  doc.triangle(fx, fy - 2, fx + 2, fy, fx, fy + 2, 'F');
  doc.triangle(fx, fy - 2, fx - 2, fy, fx, fy + 2, 'F');

  // Company name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', fx, pH - 25, { align: 'center' });

  // Company details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...C.muted);
  doc.text('GSTIN: 27AADCV1234A1ZB   |   CIN: U34100MH2024PTC123456', fx, pH - 19, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010   |   +91 98765 43210   |   info@velocity.in', fx, pH - 14, { align: 'center' });

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.goldLight);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', fx, pH - 8, { align: 'center' });
};

// ─── Main Export ─────────────────────────────────────────────
export const generateInvoicePDF = (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawBg(doc);
  drawHeader(doc, order);

  const tableStart = drawCustomerSection(doc, order);
  const tableEnd = drawItemsTable(doc, tableStart, items);

  drawTotals(doc, order, tableEnd);
  drawFooter(doc);

  doc.save(`Velocity-Invoice-${txt(order.order_number, 'ORDER')}.pdf`);
};
