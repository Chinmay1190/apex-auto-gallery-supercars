import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import velocityLogo from '@/assets/logo-velocity.png';

type RGB = [number, number, number];

const colors = {
  bg: [12, 12, 16] as RGB,
  panel: [22, 22, 28] as RGB,
  panelSoft: [28, 28, 36] as RGB,
  gold: [192, 155, 68] as RGB,
  goldSoft: [220, 192, 132] as RGB,
  text: [246, 246, 248] as RGB,
  muted: [170, 170, 180] as RGB,
  dim: [118, 118, 130] as RGB,
  border: [44, 44, 56] as RGB,
  rowAlt: [17, 17, 24] as RGB,
};

const PAGE_WIDTH = 210;
const LEFT = 16;
const RIGHT = 194;
let FONT = 'helvetica';

const formatMoney = (n: number): string => {
  const v = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0);
  return FONT === 'NotoSans' ? `\u20B9 ${v}` : `Rs. ${v}`;
};

const loadImage = (src: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const loadFontBuffer = async (url: string): Promise<ArrayBuffer | null> => {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.arrayBuffer();
  } catch {
    return null;
  }
};

const bufToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const registerNotoSans = async (doc: jsPDF): Promise<boolean> => {
  try {
    const [reg, bold] = await Promise.all([
      loadFontBuffer('/fonts/NotoSans-Regular.ttf'),
      loadFontBuffer('/fonts/NotoSans-Bold.ttf'),
    ]);
    if (reg) {
      doc.addFileToVFS('NotoSans-Regular.ttf', bufToBase64(reg));
      doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    }
    if (bold) {
      doc.addFileToVFS('NotoSans-Bold.ttf', bufToBase64(bold));
      doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');
    }
    return !!(reg && bold);
  } catch {
    return false;
  }
};

const drawBg = (doc: jsPDF) => {
  const h = doc.internal.pageSize.height;
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, PAGE_WIDTH, h, 'F');
  doc.setFillColor(...colors.gold);
  doc.rect(0, 0, PAGE_WIDTH, 2.2, 'F');
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.7);
  doc.line(8, 8, 20, 8); doc.line(8, 8, 8, 20);
  doc.line(PAGE_WIDTH - 20, 8, PAGE_WIDTH - 8, 8);
  doc.line(PAGE_WIDTH - 8, 8, PAGE_WIDTH - 8, 20);
};

const drawHeader = (doc: jsPDF, title: string, subtitle: string, logo: string | null) => {
  doc.setFillColor(...colors.panel);
  doc.rect(0, 2.2, PAGE_WIDTH, 46, 'F');

  if (logo) {
    try { doc.addImage(logo, 'PNG', LEFT, 6, 18, 18); } catch { /* */ }
  }
  const textStart = logo ? LEFT + 22 : LEFT;

  doc.setFont(FONT, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...colors.gold);
  doc.text('VELOCITY', textStart, 20);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.dim);
  doc.text('A N A L Y T I C S   &   R E P O R T S', textStart, 27);

  doc.setFillColor(...colors.gold);
  doc.rect(textStart, 30, 28, 1, 'F');

  // Right badge
  doc.setFillColor(...colors.panelSoft);
  doc.roundedRect(PAGE_WIDTH - 84, 8, 68, 32, 3, 3, 'F');
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.45);
  doc.roundedRect(PAGE_WIDTH - 84, 8, 68, 32, 3, 3, 'S');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.gold);
  doc.text(title.toUpperCase(), PAGE_WIDTH - 50, 17, { align: 'center' });

  doc.setFont(FONT, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...colors.goldSoft);
  doc.text(subtitle, PAGE_WIDTH - 50, 24, { align: 'center' });

  doc.setTextColor(...colors.muted);
  doc.setFontSize(6.5);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    PAGE_WIDTH - 50, 31, { align: 'center' });

  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.4);
  doc.line(LEFT, 52, RIGHT, 52);
};

const drawStatCards = (doc: jsPDF, y: number, stats: { label: string; value: string }[]): number => {
  const gap = 4;
  const w = (RIGHT - LEFT - gap * (stats.length - 1)) / stats.length;
  const h = 22;

  stats.forEach((s, i) => {
    const x = LEFT + i * (w + gap);
    doc.setFillColor(...colors.panel);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, w, h, 3, 3, 'S');
    doc.setFillColor(...colors.gold);
    doc.rect(x, y + 3, 2, h - 6, 'F');

    doc.setFont(FONT, 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...colors.dim);
    doc.text(s.label.toUpperCase(), x + 5, y + 7);

    doc.setFont(FONT, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colors.goldSoft);
    doc.text(s.value, x + 5, y + 16);
  });

  return y + h + 4;
};

const drawSectionTitle = (doc: jsPDF, y: number, title: string): number => {
  doc.setFillColor(...colors.gold);
  doc.rect(LEFT, y, 3, 5, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...colors.gold);
  doc.text(title.toUpperCase(), LEFT + 6, y + 4);
  return y + 8;
};

const drawFooter = (doc: jsPDF) => {
  const h = doc.internal.pageSize.height;
  const fy = h - 18;
  doc.setFillColor(...colors.panel);
  doc.rect(0, fy, PAGE_WIDTH, 18, 'F');
  doc.setFillColor(...colors.gold);
  doc.rect(0, fy, PAGE_WIDTH, 1, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...colors.gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', PAGE_WIDTH / 2, fy + 6, { align: 'center' });
  doc.setFont(FONT, 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...colors.dim);
  doc.text('Confidential \u2014 for internal use only.', PAGE_WIDTH / 2, fy + 11, { align: 'center' });
  doc.setTextColor(...colors.goldSoft);
  doc.text('Drive the extraordinary.', PAGE_WIDTH / 2, fy + 15, { align: 'center' });
};

export interface ReportOrder {
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
}

export interface CategoryStat {
  category: string;
  units: number;
  revenue: number;
}

export interface CarPurchase {
  name: string;
  brand: string;
  units: number;
  revenue: number;
}

export interface ReportData {
  title: string;
  subtitle: string;
  orders: ReportOrder[];
  categoryBreakdown: CategoryStat[];
  carsPurchased?: CarPurchase[];
}

export const generateReportPDF = async (data: ReportData) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Register font + load logo in parallel
  const [fontLoaded, logo] = await Promise.all([
    registerNotoSans(doc),
    loadImage(velocityLogo),
  ]);
  FONT = fontLoaded ? 'NotoSans' : 'helvetica';
  doc.setFont(FONT, 'normal');

  // Page chrome — track which pages have already had bg/header/footer drawn
  const styledPages = new Set<number>();
  const stylePage = (pageNum: number) => {
    if (styledPages.has(pageNum)) return;
    styledPages.add(pageNum);
    const cur = doc.getCurrentPageInfo().pageNumber;
    doc.setPage(pageNum);
    drawBg(doc);
    drawHeader(doc, data.title, data.subtitle, logo);
    drawFooter(doc);
    doc.setPage(cur);
  };

  // Style page 1 BEFORE any content is drawn
  stylePage(1);

  const totalRevenue = data.orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = data.orders.length;
  const delivered = data.orders.filter(o => o.status === 'delivered').length;
  const avgValue = totalOrders ? totalRevenue / totalOrders : 0;

  let y = 58;
  y = drawStatCards(doc, y, [
    { label: 'Total Orders', value: String(totalOrders) },
    { label: 'Revenue', value: formatMoney(totalRevenue) },
    { label: 'Avg Order', value: formatMoney(avgValue) },
    { label: 'Delivered', value: String(delivered) },
  ]);

  y = drawSectionTitle(doc, y + 2, 'Category-wise Sales');
  if (data.categoryBreakdown.length === 0) {
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text('No category data for this period.', LEFT, y + 4);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      head: [['CATEGORY', 'UNITS SOLD', 'REVENUE', 'SHARE']],
      body: data.categoryBreakdown.map(c => [
        c.category,
        String(c.units),
        formatMoney(c.revenue),
        totalRevenue ? `${((c.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%',
      ]),
      theme: 'plain',
      margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 22 },
      styles: {
        font: FONT, fontSize: 8, textColor: [...colors.text],
        lineColor: [...colors.border], lineWidth: 0.15,
        cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
      },
      headStyles: {
        fillColor: [...colors.panelSoft], textColor: [...colors.gold],
        fontStyle: 'bold', fontSize: 6.5,
      },
      alternateRowStyles: { fillColor: [...colors.rowAlt] },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'right', textColor: [...colors.goldSoft] },
        3: { halign: 'right', textColor: [...colors.muted] },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Cars Purchased section
  if (data.carsPurchased && data.carsPurchased.length > 0) {
    y = drawSectionTitle(doc, y + 2, 'Cars Purchased');
    autoTable(doc, {
      startY: y,
      head: [['BRAND', 'MODEL', 'UNITS', 'REVENUE']],
      body: data.carsPurchased.map(c => [
        c.brand,
        c.name,
        String(c.units),
        formatMoney(c.revenue),
      ]),
      theme: 'plain',
      margin: { left: LEFT, right: PAGE_WIDTH - RIGHT, bottom: 22 },
      styles: {
        font: FONT, fontSize: 8, textColor: [...colors.text],
        lineColor: [...colors.border], lineWidth: 0.15,
        cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
      },
      headStyles: {
        fillColor: [...colors.panelSoft], textColor: [...colors.gold],
        fontStyle: 'bold', fontSize: 6.5,
      },
      alternateRowStyles: { fillColor: [...colors.rowAlt] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [...colors.goldSoft], cellWidth: 40 },
        1: { fontStyle: 'bold' },
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'right', textColor: [...colors.goldSoft], cellWidth: 42 },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  y = drawSectionTitle(doc, y + 2, 'Orders in Period');
  if (data.orders.length === 0) {
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
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
      styles: {
        font: FONT, fontSize: 7.5, textColor: [...colors.text],
        lineColor: [...colors.border], lineWidth: 0.15,
        cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      },
      headStyles: {
        fillColor: [...colors.panelSoft], textColor: [...colors.gold],
        fontStyle: 'bold', fontSize: 6.5,
      },
      alternateRowStyles: { fillColor: [...colors.rowAlt] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [...colors.goldSoft] },
        4: { halign: 'right', fontStyle: 'bold', textColor: [...colors.goldSoft] },
      },
      willDrawPage: (d) => stylePage(d.pageNumber),
    });
  }

  doc.save(`Velocity-${data.title.replace(/\s+/g, '-')}-${data.subtitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};
