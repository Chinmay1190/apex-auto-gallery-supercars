import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import velocityLogo from '@/assets/logo-velocity.png';

type RGB = [number, number, number];

const C = {
  paper: [253, 251, 246] as RGB,
  cream: [247, 243, 234] as RGB,
  ink: [22, 22, 26] as RGB,
  body: [55, 55, 62] as RGB,
  muted: [120, 118, 112] as RGB,
  dim: [165, 162, 154] as RGB,
  hair: [225, 218, 200] as RGB,
  gold: [176, 137, 52] as RGB,
  goldDeep: [140, 105, 30] as RGB,
  goldSoft: [225, 200, 130] as RGB,
};

const PAGE_WIDTH = 210;
const LEFT = 16;
const RIGHT = 194;
let FONT = 'helvetica';

const formatMoney = (n: number): string => {
  const v = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  return FONT === 'NotoSans' ? `\u20B9 ${v}` : `Rs. ${v}`;
};

const loadImage = (src: string): Promise<string | null> =>
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
        resolve(c.toDataURL('image/png'));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const loadFontBuf = async (url: string): Promise<ArrayBuffer | null> => {
  try { const r = await fetch(url); return r.ok ? await r.arrayBuffer() : null; } catch { return null; }
};
const bufToB64 = (buf: ArrayBuffer): string => {
  const b = new Uint8Array(buf); let s = '';
  for (let i = 0; i < b.byteLength; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
};
const registerNotoSans = async (doc: jsPDF): Promise<boolean> => {
  try {
    const [reg, bold] = await Promise.all([
      loadFontBuf('/fonts/NotoSans-Regular.ttf'),
      loadFontBuf('/fonts/NotoSans-Bold.ttf'),
    ]);
    if (reg) { doc.addFileToVFS('NotoSans-Regular.ttf', bufToB64(reg)); doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal'); }
    if (bold) { doc.addFileToVFS('NotoSans-Bold.ttf', bufToB64(bold)); doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold'); }
    return !!(reg && bold);
  } catch { return false; }
};

const drawChrome = (doc: jsPDF) => {
  const h = doc.internal.pageSize.height;
  doc.setFillColor(...C.paper);
  doc.rect(0, 0, PAGE_WIDTH, h, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(0, 0, PAGE_WIDTH, 4, 'F');
  doc.setFillColor(...C.goldDeep);
  doc.rect(0, 4, PAGE_WIDTH, 0.6, 'F');
  doc.setFillColor(...C.gold);
  doc.rect(0, h - 4, PAGE_WIDTH, 4, 'F');
  doc.setFillColor(...C.goldDeep);
  doc.rect(0, h - 4.6, PAGE_WIDTH, 0.6, 'F');
  doc.setDrawColor(...C.goldSoft); doc.setLineWidth(0.25);
  doc.rect(8, 9, PAGE_WIDTH - 16, h - 18, 'S');
  doc.setDrawColor(...C.hair); doc.setLineWidth(0.15);
  doc.rect(10, 11, PAGE_WIDTH - 20, h - 22, 'S');
};

const drawHeader = (doc: jsPDF, title: string, subtitle: string, logo: string | null) => {
  if (logo) { try { doc.addImage(logo, 'PNG', LEFT, 16, 20, 20); } catch { /* */ } }
  const tx = logo ? LEFT + 24 : LEFT;

  doc.setFont(FONT, 'bold'); doc.setFontSize(26); doc.setTextColor(...C.ink);
  doc.text('VELOCITY', tx, 26);
  doc.setFont(FONT, 'normal'); doc.setFontSize(6.5); doc.setTextColor(...C.goldDeep);
  doc.text('A N A L Y T I C S   &   R E P O R T S', tx, 31);
  doc.setDrawColor(...C.gold); doc.setLineWidth(0.8);
  doc.line(tx, 33.5, tx + 36, 33.5);

  // Right title
  doc.setFont(FONT, 'bold'); doc.setFontSize(18); doc.setTextColor(...C.goldDeep);
  doc.text(title.toUpperCase(), RIGHT, 23, { align: 'right' });
  doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(...C.muted);
  doc.text(subtitle, RIGHT, 29, { align: 'right' });
  doc.setFontSize(6.5); doc.setTextColor(...C.dim);
  doc.text(`Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    RIGHT, 34, { align: 'right' });

  doc.setDrawColor(...C.gold); doc.setLineWidth(0.5);
  doc.line(LEFT, 42, RIGHT, 42);
  doc.setDrawColor(...C.goldSoft); doc.setLineWidth(0.2);
  doc.line(LEFT, 43.5, RIGHT, 43.5);
};

const drawStatCards = (doc: jsPDF, y: number, stats: { label: string; value: string }[]): number => {
  const gap = 4;
  const w = (RIGHT - LEFT - gap * (stats.length - 1)) / stats.length;
  const h = 24;
  stats.forEach((s, i) => {
    const x = LEFT + i * (w + gap);
    doc.setFillColor(...C.ink);
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(x, y, w, 1.4, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(x, y + 4, 2, h - 8, 'F');

    doc.setFont(FONT, 'normal'); doc.setFontSize(6); doc.setTextColor(...C.goldSoft);
    doc.text(s.label.toUpperCase(), x + 6, y + 9);
    doc.setFont(FONT, 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
    doc.text(s.value, x + 6, y + 18);
  });
  return y + h + 6;
};

const drawSectionTitle = (doc: jsPDF, y: number, title: string): number => {
  doc.setFillColor(...C.gold);
  doc.rect(LEFT, y, 3, 6, 'F');
  doc.setFont(FONT, 'bold'); doc.setFontSize(11); doc.setTextColor(...C.ink);
  doc.text(title, LEFT + 6, y + 5);
  doc.setDrawColor(...C.goldSoft); doc.setLineWidth(0.2);
  doc.line(LEFT, y + 8, RIGHT, y + 8);
  return y + 12;
};

const drawFooter = (doc: jsPDF, pageNum: number, total: number) => {
  const h = doc.internal.pageSize.height;
  const fy = h - 14;
  doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(...C.goldDeep);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', PAGE_WIDTH / 2, fy, { align: 'center' });
  doc.setFont(FONT, 'normal'); doc.setFontSize(5.5); doc.setTextColor(...C.muted);
  doc.text('Confidential analytics report \u00B7 For internal use only', PAGE_WIDTH / 2, fy + 4, { align: 'center' });
  doc.setTextColor(...C.dim);
  doc.text(`Page ${pageNum} of ${total}`, RIGHT, fy + 4, { align: 'right' });
  doc.setTextColor(...C.goldDeep);
  doc.text('Drive the extraordinary.', PAGE_WIDTH / 2, fy + 8, { align: 'center' });
};

export interface ReportOrder { order_number: string; created_at: string; total: number; status: string; payment_method: string; }
export interface CategoryStat { category: string; units: number; revenue: number; }
export interface CarPurchase { name: string; brand: string; units: number; revenue: number; }
export interface ReportData {
  title: string; subtitle: string;
  orders: ReportOrder[]; categoryBreakdown: CategoryStat[]; carsPurchased?: CarPurchase[];
}

export const generateReportPDF = async (data: ReportData) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const [fontLoaded, logo] = await Promise.all([registerNotoSans(doc), loadImage(velocityLogo)]);
  FONT = fontLoaded ? 'NotoSans' : 'helvetica';
  doc.setFont(FONT, 'normal');

  const styled = new Set<number>();
  const stylePage = (n: number) => {
    if (styled.has(n)) return;
    styled.add(n);
    const cur = doc.getCurrentPageInfo().pageNumber;
    doc.setPage(n);
    drawChrome(doc);
    drawHeader(doc, data.title, data.subtitle, logo);
    doc.setPage(cur);
  };
  stylePage(1);

  const totalRevenue = data.orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = data.orders.length;
  const delivered = data.orders.filter(o => o.status === 'delivered').length;
  const avgValue = totalOrders ? totalRevenue / totalOrders : 0;

  let y = 52;
  y = drawStatCards(doc, y, [
    { label: 'Total Orders', value: String(totalOrders) },
    { label: 'Revenue', value: formatMoney(totalRevenue) },
    { label: 'Avg Order', value: formatMoney(avgValue) },
    { label: 'Delivered', value: String(delivered) },
  ]);

  // Category-wise Sales
  y = drawSectionTitle(doc, y + 2, 'Category-wise Sales');
  if (data.categoryBreakdown.length === 0) {
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(...C.muted);
    doc.text('No category data for this period.', LEFT, y + 4);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      head: [['CATEGORY', 'UNITS', 'REVENUE', 'SHARE']],
      body: data.categoryBreakdown.map(c => [
        c.category, String(c.units), formatMoney(c.revenue),
        totalRevenue ? `${((c.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%',
      ]),
      theme: 'plain',
      margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 22 },
      styles: { font: FONT, fontSize: 8.5, textColor: [...C.body],
        lineColor: [...C.hair], lineWidth: 0.15,
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 } },
      headStyles: { fillColor: [...C.ink], textColor: [...C.goldSoft], fontStyle: 'bold', fontSize: 6.8 },
      alternateRowStyles: { fillColor: [...C.cream] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [...C.ink] },
        1: { halign: 'center' },
        2: { halign: 'right', textColor: [...C.ink], fontStyle: 'bold' },
        3: { halign: 'right', textColor: [...C.goldDeep] },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Cars Purchased
  if (data.carsPurchased && data.carsPurchased.length > 0) {
    y = drawSectionTitle(doc, y + 2, 'Cars Purchased');
    autoTable(doc, {
      startY: y,
      head: [['BRAND', 'MODEL', 'UNITS', 'REVENUE']],
      body: data.carsPurchased.map(c => [c.brand, c.name, String(c.units), formatMoney(c.revenue)]),
      theme: 'plain',
      margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 22 },
      styles: { font: FONT, fontSize: 8.5, textColor: [...C.body],
        lineColor: [...C.hair], lineWidth: 0.15,
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 } },
      headStyles: { fillColor: [...C.ink], textColor: [...C.goldSoft], fontStyle: 'bold', fontSize: 6.8 },
      alternateRowStyles: { fillColor: [...C.cream] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [...C.goldDeep], cellWidth: 40 },
        1: { fontStyle: 'bold', textColor: [...C.ink] },
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'right', textColor: [...C.ink], fontStyle: 'bold', cellWidth: 42 },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Orders
  y = drawSectionTitle(doc, y + 2, 'Orders in Period');
  if (data.orders.length === 0) {
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(...C.muted);
    doc.text('No orders found in this period.', LEFT, y + 4);
  } else {
    autoTable(doc, {
      startY: y,
      head: [['ORDER #', 'DATE', 'PAYMENT', 'STATUS', 'AMOUNT']],
      body: data.orders.map(o => [
        o.order_number,
        new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        (o.payment_method || '-').toUpperCase(),
        (o.status || '-').toUpperCase(),
        formatMoney(o.total),
      ]),
      theme: 'plain',
      margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 22 },
      styles: { font: FONT, fontSize: 8, textColor: [...C.body],
        lineColor: [...C.hair], lineWidth: 0.15,
        cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 } },
      headStyles: { fillColor: [...C.ink], textColor: [...C.goldSoft], fontStyle: 'bold', fontSize: 6.8 },
      alternateRowStyles: { fillColor: [...C.cream] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [...C.goldDeep] },
        4: { halign: 'right', fontStyle: 'bold', textColor: [...C.ink] },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
  }

  // Footer on every page
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) { doc.setPage(i); drawFooter(doc, i, total); }

  doc.save(`Velocity-${data.title.replace(/\s+/g, '-')}-${data.subtitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};
