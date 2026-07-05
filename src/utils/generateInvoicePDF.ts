import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import velocityLogo from '@/assets/logo-velocity.png';

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
  car_image?: string;
  car?: { name: string; brand: string; price: number; image?: string };
  price?: number;
  quantity: number;
}

type RGB = [number, number, number];

// Light, premium palette — ivory paper, deep gold, ink
const C = {
  paper: [253, 251, 246] as RGB,
  cream: [247, 243, 234] as RGB,
  card: [255, 253, 249] as RGB,
  ink: [22, 22, 26] as RGB,
  body: [55, 55, 62] as RGB,
  muted: [120, 118, 112] as RGB,
  dim: [165, 162, 154] as RGB,
  hair: [225, 218, 200] as RGB,
  gold: [176, 137, 52] as RGB,
  goldDeep: [140, 105, 30] as RGB,
  goldSoft: [225, 200, 130] as RGB,
};

let FONT = 'helvetica';
const PAGE_WIDTH = 210;
const LEFT = 16;
const RIGHT = 194;
const CONTENT_WIDTH = RIGHT - LEFT;

const toNumber = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const p = Number(v.replace(/[^\d.-]/g, ''));
    return Number.isFinite(p) ? p : 0;
  }
  return 0;
};
const toText = (v: unknown, fb = '-'): string => (String(v ?? '').trim() || fb);
const formatMoney = (v: unknown): string => {
  const n = toNumber(v);
  const f = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return FONT === 'NotoSans' ? `\u20B9 ${f}` : `Rs. ${f}`;
};
const formatDate = (v: unknown): string => {
  const d = new Date(String(v ?? ''));
  if (Number.isNaN(d.getTime())) return toText(v, 'N/A');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

// Indian-numbering amount-in-words (rupees + paise)
const numToWordsIN = (num: number): string => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = (n: number): string => n < 20 ? a[n] : `${b[Math.floor(n / 10)]}${n % 10 ? ' ' + a[n % 10] : ''}`;
  const three = (n: number): string => {
    const h = Math.floor(n / 100), r = n % 100;
    return `${h ? a[h] + ' Hundred' + (r ? ' ' : '') : ''}${r ? two(r) : ''}`;
  };
  if (!Number.isFinite(num) || num <= 0) return 'Zero';
  const n = Math.floor(num);
  const p = Math.round((num - n) * 100);
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thou = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  let out = '';
  if (crore) out += two(crore) + ' Crore ';
  if (lakh) out += two(lakh) + ' Lakh ';
  if (thou) out += two(thou) + ' Thousand ';
  if (rest) out += three(rest);
  out = out.trim() + ' Rupees';
  if (p > 0) out += ' and ' + two(p) + ' Paise';
  return out + ' Only';
};

const loadImageAsBase64 = (src: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth || img.width;
        c.height = img.naturalHeight || img.height;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', 0.85));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const loadFontAB = async (url: string): Promise<ArrayBuffer | null> => {
  try { const r = await fetch(url); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
};
const abToB64 = (buf: ArrayBuffer): string => {
  const b = new Uint8Array(buf); let s = '';
  for (let i = 0; i < b.byteLength; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
};
const registerNotoSans = async (doc: jsPDF): Promise<boolean> => {
  try {
    const [reg, bold] = await Promise.all([
      loadFontAB('/fonts/NotoSans-Regular.ttf'),
      loadFontAB('/fonts/NotoSans-Bold.ttf'),
    ]);
    if (reg) { doc.addFileToVFS('NotoSans-Regular.ttf', abToB64(reg)); doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal'); }
    if (bold) { doc.addFileToVFS('NotoSans-Bold.ttf', abToB64(bold)); doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold'); }
    return !!(reg && bold);
  } catch { return false; }
};

const drawPageChrome = (doc: jsPDF) => {
  const h = doc.internal.pageSize.height;
  // Paper background
  doc.setFillColor(...C.paper);
  doc.rect(0, 0, PAGE_WIDTH, h, 'F');
  // Top & bottom gold band
  doc.setFillColor(...C.gold);
  doc.rect(0, 0, PAGE_WIDTH, 4, 'F');
  doc.setFillColor(...C.goldDeep);
  doc.rect(0, 4, PAGE_WIDTH, 0.6, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(0, h - 4, PAGE_WIDTH, 4, 'F');
  doc.setFillColor(...C.goldDeep);
  doc.rect(0, h - 4.6, PAGE_WIDTH, 0.6, 'F');
  // Inner hairline frame
  doc.setDrawColor(...C.goldSoft);
  doc.setLineWidth(0.25);
  doc.rect(8, 9, PAGE_WIDTH - 16, h - 18, 'S');
  doc.setDrawColor(...C.hair);
  doc.setLineWidth(0.15);
  doc.rect(10, 11, PAGE_WIDTH - 20, h - 22, 'S');
};

const drawHeader = (doc: jsPDF, order: InvoiceOrder, logo: string | null) => {
  // Brand mark
  if (logo) {
    try { doc.addImage(logo, 'PNG', LEFT, 16, 20, 20); } catch { /* */ }
  }
  const tx = logo ? LEFT + 24 : LEFT;

  doc.setFont(FONT, 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...C.ink);
  doc.text('VELOCITY', tx, 26);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.goldDeep);
  doc.text('L U X U R Y   S U P E R C A R S   \u00B7   I N D I A', tx, 31);

  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.8);
  doc.line(tx, 33.5, tx + 36, 33.5);

  // Invoice label block — right
  doc.setFont(FONT, 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...C.goldDeep);
  doc.text('INVOICE', RIGHT, 22, { align: 'right' });

  doc.setFont(FONT, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text('Invoice No.', RIGHT - 38, 28);
  doc.setFont(FONT, 'bold');
  doc.setTextColor(...C.ink);
  doc.text(toText(order.order_number, 'N/A'), RIGHT, 28, { align: 'right' });

  doc.setFont(FONT, 'normal');
  doc.setTextColor(...C.muted);
  doc.text('Date', RIGHT - 38, 33);
  doc.setFont(FONT, 'bold');
  doc.setTextColor(...C.ink);
  doc.text(formatDate(order.created_at), RIGHT, 33, { align: 'right' });

  // Divider under header
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(LEFT, 42, RIGHT, 42);
  doc.setDrawColor(...C.goldSoft);
  doc.setLineWidth(0.2);
  doc.line(LEFT, 43.5, RIGHT, 43.5);
};

const drawAddressBlock = (doc: jsPDF, x: number, y: number, w: number, label: string, lines: string[]) => {
  doc.setFont(FONT, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.goldDeep);
  doc.text(label, x, y);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.4);
  doc.line(x, y + 1.5, x + 14, y + 1.5);

  let ly = y + 7;
  lines.forEach((raw, i) => {
    const wrapped = doc.splitTextToSize(toText(raw), w);
    doc.setFont(FONT, i === 0 ? 'bold' : 'normal');
    doc.setFontSize(i === 0 ? 9.5 : 8);
    doc.setTextColor(...(i === 0 ? C.ink : C.body));
    wrapped.slice(0, 2).forEach((ln: string) => { doc.text(ln, x, ly); ly += i === 0 ? 5 : 4.5; });
  });
};

const drawParties = (doc: jsPDF, order: InvoiceOrder): number => {
  const y = 52;
  const colW = (CONTENT_WIDTH - 8) / 2;

  drawAddressBlock(doc, LEFT, y, colW, 'BILLED TO', [
    order.shipping_name,
    order.shipping_email,
    order.shipping_phone,
  ]);
  drawAddressBlock(doc, LEFT + colW + 8, y, colW, 'SHIPPED TO', [
    order.shipping_address,
    `${toText(order.shipping_city)}, ${toText(order.shipping_state)}`,
    `PIN ${toText(order.shipping_pincode)}`,
  ]);

  // Payment pill
  const py = y + 30;
  doc.setFillColor(...C.cream);
  doc.roundedRect(LEFT, py, CONTENT_WIDTH, 9, 1.5, 1.5, 'F');
  doc.setDrawColor(...C.goldSoft);
  doc.setLineWidth(0.2);
  doc.roundedRect(LEFT, py, CONTENT_WIDTH, 9, 1.5, 1.5, 'S');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.goldDeep);
  doc.text('PAYMENT METHOD', LEFT + 4, py + 5.8);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.ink);
  doc.text(toText(order.payment_method, 'N/A').toUpperCase(), LEFT + 42, py + 5.8);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.text('STATUS', RIGHT - 30, py + 5.8);
  doc.setFont(FONT, 'bold');
  doc.setTextColor(...C.goldDeep);
  doc.setFontSize(8.5);
  doc.text('PAID', RIGHT - 4, py + 5.8, { align: 'right' });

  return py + 15;
};

const drawItems = (doc: jsPDF, startY: number, items: InvoiceItem[], carImages: Map<number, string>): number => {
  const safe = items.length ? items : [{ quantity: 1 } as InvoiceItem];
  const rows = safe.map((it, idx) => {
    const name = toText(it.car?.name || it.car_name || 'Vehicle');
    const brand = toText(it.car?.brand || it.car_brand || '-');
    const unit = toNumber(it.car?.price ?? it.price);
    const qty = Math.max(1, Math.floor(toNumber(it.quantity)));
    return [String(idx + 1).padStart(2, '0'), '', name, brand, String(qty), formatMoney(unit), formatMoney(unit * qty)];
  });

  autoTable(doc, {
    startY,
    head: [['#', '', 'VEHICLE', 'BRAND', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: rows,
    theme: 'plain',
    margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 28 },
    styles: {
      font: FONT, fontSize: 8.5, textColor: [...C.body],
      lineColor: [...C.hair], lineWidth: 0.15,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      minCellHeight: 14, valign: 'middle',
    },
    headStyles: {
      fillColor: [...C.ink], textColor: [...C.goldSoft],
      fontStyle: 'bold', fontSize: 6.8,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 }, minCellHeight: 9,
    },
    alternateRowStyles: { fillColor: [...C.cream] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10, textColor: [...C.goldDeep], fontStyle: 'bold' },
      1: { cellWidth: 16 },
      2: { cellWidth: 42, fontStyle: 'bold', textColor: [...C.ink] },
      3: { cellWidth: 24, textColor: [...C.muted] },
      4: { halign: 'center', cellWidth: 10 },
      5: { halign: 'right', cellWidth: 32 },
      6: { halign: 'right', cellWidth: 32, textColor: [...C.ink], fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const img = carImages.get(data.row.index);
        if (img) {
          try {
            const sz = 10;
            const x = data.cell.x + (data.cell.width - sz) / 2;
            const y = data.cell.y + (data.cell.height - sz) / 2;
            doc.setDrawColor(...C.goldSoft);
            doc.setLineWidth(0.3);
            doc.roundedRect(x - 0.6, y - 0.6, sz + 1.2, sz + 1.2, 1.2, 1.2, 'S');
            doc.addImage(img, 'JPEG', x, y, sz, sz);
          } catch { /* */ }
        }
      }
    },
    willDrawPage: (d) => (doc as any).__chromePage?.(d.pageNumber),
  });
  return (doc as any).lastAutoTable?.finalY || startY + 30;
};

const drawTotals = (doc: jsPDF, order: InvoiceOrder, fromY: number): number => {
  const h = doc.internal.pageSize.height;
  const hasDiscount = toNumber(order.discount) > 0;
  const cardH = hasDiscount ? 46 : 38;
  let y = fromY + 6;
  if (y + cardH + 50 > h - 14) { doc.addPage(); drawPageChrome(doc); y = 20; }

  // Notes — left
  doc.setFont(FONT, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.text('Notes', LEFT, y + 4);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(LEFT, y + 5.5, LEFT + 10, y + 5.5);
  doc.setFontSize(7);
  doc.setTextColor(...C.body);
  doc.text('All prices include applicable GST at 28%.', LEFT, y + 10);
  doc.text('Vehicle delivered with manufacturer warranty.', LEFT, y + 14);
  doc.text('E. & O.E.   |   Computer-generated invoice.', LEFT, y + 18);

  // Totals card — right
  const cardX = 118;
  const cardW = RIGHT - cardX;
  doc.setFillColor(...C.ink);
  doc.roundedRect(cardX, y, cardW, cardH, 2, 2, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(cardX, y, cardW, 1.4, 'F');

  let ly = y + 8;
  const row = (label: string, value: string, opts?: { bold?: boolean; soft?: boolean }) => {
    const bold = !!opts?.bold;
    doc.setFont(FONT, bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 10 : 8);
    doc.setTextColor(...(bold ? C.goldSoft : C.dim));
    doc.text(label, cardX + 6, ly);
    doc.setTextColor(...(bold ? [255, 255, 255] as RGB : opts?.soft ? C.goldSoft : [240, 236, 226] as RGB));
    doc.text(value, cardX + cardW - 6, ly, { align: 'right' });
    ly += 7.5;
  };

  row('Subtotal', formatMoney(order.subtotal));
  row('GST (28%)', formatMoney(order.gst_amount), { soft: true });
  if (hasDiscount) row('Discount', `- ${formatMoney(order.discount)}`);

  doc.setDrawColor(...C.goldSoft);
  doc.setLineWidth(0.3);
  doc.line(cardX + 6, ly - 3, cardX + cardW - 6, ly - 3);
  ly += 2;
  row('GRAND TOTAL', formatMoney(order.total), { bold: true });

  // Amount in words strip — spans full width below
  const wordsY = y + cardH + 4;
  doc.setFillColor(...C.cream);
  doc.roundedRect(LEFT, wordsY, CONTENT_WIDTH, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(...C.goldSoft); doc.setLineWidth(0.2);
  doc.roundedRect(LEFT, wordsY, CONTENT_WIDTH, 10, 1.5, 1.5, 'S');
  doc.setFont(FONT, 'bold'); doc.setFontSize(6.2); doc.setTextColor(...C.goldDeep);
  doc.text('AMOUNT IN WORDS', LEFT + 4, wordsY + 4);
  doc.setFont(FONT, 'bold'); doc.setFontSize(8); doc.setTextColor(...C.ink);
  const words = numToWordsIN(toNumber(order.total));
  const wrapped = doc.splitTextToSize(words, CONTENT_WIDTH - 8);
  doc.text(wrapped[0] || '', LEFT + 4, wordsY + 8);

  return wordsY + 10;
};

const drawSignatory = (doc: jsPDF, afterY: number) => {
  const h = doc.internal.pageSize.height;
  let y = afterY + 8;
  if (y + 32 > h - 18) { doc.addPage(); drawPageChrome(doc); y = 22; }

  // Left — seal
  const sx = LEFT + 12, sy = y + 10;
  doc.setDrawColor(...C.gold); doc.setLineWidth(0.5); doc.circle(sx, sy, 8, 'S');
  doc.setLineWidth(0.25); doc.circle(sx, sy, 6.5, 'S');
  doc.setFont(FONT, 'bold'); doc.setFontSize(4.5); doc.setTextColor(...C.goldDeep);
  doc.text('VELOCITY', sx, sy - 1, { align: 'center' });
  doc.setFontSize(3.5);
  doc.text('SUPERCARS', sx, sy + 1.5, { align: 'center' });
  doc.setFont(FONT, 'normal'); doc.setFontSize(3); doc.setTextColor(...C.muted);
  doc.text('OFFICIAL SEAL', sx, sy + 4, { align: 'center' });

  // Right — signatory
  const lineX1 = RIGHT - 60, lineX2 = RIGHT - 4, lineY = y + 14;
  doc.setDrawColor(...C.gold); doc.setLineWidth(0.5);
  doc.line(lineX1 + 2, lineY - 2, lineX1 + 18, lineY - 5);
  doc.line(lineX1 + 18, lineY - 5, lineX1 + 28, lineY);
  doc.line(lineX1 + 28, lineY, lineX1 + 36, lineY - 4);
  doc.line(lineX1 + 36, lineY - 4, lineX2 - 4, lineY - 2);
  doc.setDrawColor(...C.hair); doc.setLineWidth(0.3);
  doc.line(lineX1, lineY + 2, lineX2, lineY + 2);

  doc.setFont(FONT, 'bold'); doc.setFontSize(8); doc.setTextColor(...C.ink);
  doc.text('Chinmay Pinglee', (lineX1 + lineX2) / 2, lineY + 7, { align: 'center' });
  doc.setFont(FONT, 'normal'); doc.setFontSize(6); doc.setTextColor(...C.muted);
  doc.text('Authorized Signatory  \u00B7  CEO', (lineX1 + lineX2) / 2, lineY + 11, { align: 'center' });
};

const drawFooter = (doc: jsPDF) => {
  const h = doc.internal.pageSize.height;
  const fy = h - 14;
  doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(...C.goldDeep);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', PAGE_WIDTH / 2, fy, { align: 'center' });
  doc.setFont(FONT, 'normal'); doc.setFontSize(5.5); doc.setTextColor(...C.muted);
  doc.text('GSTIN 27AADCV1234A1ZB  \u00B7  Dharampeth, Nagpur 440010  \u00B7  +91 98765 43210  \u00B7  info@velocity.in',
    PAGE_WIDTH / 2, fy + 4, { align: 'center' });
  doc.setTextColor(...C.goldDeep);
  doc.text('Thank you for choosing Velocity \u2014 Drive the extraordinary.', PAGE_WIDTH / 2, fy + 8, { align: 'center' });
};

export const generateInvoicePDF = async (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const [fontLoaded, logoData, ...carResults] = await Promise.all([
    registerNotoSans(doc),
    loadImageAsBase64(velocityLogo),
    ...(items || []).map((item, idx) => {
      const src = item.car_image || item.car?.image || '';
      if (!src) return Promise.resolve({ idx, data: null });
      return loadImageAsBase64(src).then((data) => ({ idx, data }));
    }),
  ]);

  FONT = fontLoaded ? 'NotoSans' : 'helvetica';
  doc.setFont(FONT, 'normal');

  const carImages = new Map<number, string>();
  carResults.forEach((r) => { if (r && r.data) carImages.set(r.idx, r.data); });

  // Track pages that have already been chromed so autoTable's willDrawPage
  // doesn't repaint the paper background over our header / body content.
  const chromed = new Set<number>();
  const chromePage = (n: number) => {
    if (chromed.has(n)) return;
    chromed.add(n);
    const cur = doc.getCurrentPageInfo().pageNumber;
    doc.setPage(n);
    drawPageChrome(doc);
    doc.setPage(cur);
  };
  // expose to helpers via closure
  (doc as any).__chromePage = chromePage;

  chromePage(1);
  drawHeader(doc, order, logoData);
  const afterParties = drawParties(doc, order);
  const afterItems = drawItems(doc, afterParties, items, carImages);
  const afterTotals = drawTotals(doc, order, afterItems);
  drawSignatory(doc, afterTotals);

  // Footer on every page
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) { doc.setPage(i); drawFooter(doc); }

  doc.save(`Velocity-Invoice-${toText(order.order_number, 'ORDER')}.pdf`);
};
