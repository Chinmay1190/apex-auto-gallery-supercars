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

let FONT = 'helvetica'; // Will be updated to NotoSans if custom font loads
const PAGE_WIDTH = 210;
const LEFT = 16;
const RIGHT = 194;
const CONTENT_WIDTH = RIGHT - LEFT;

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toText = (value: unknown, fallback = '-'): string => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

const formatMoney = (value: unknown): string => {
  const amount = toNumber(value);
  return `\u20B9 ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const formatDate = (value: unknown): string => {
  const date = new Date(String(value ?? ''));
  if (Number.isNaN(date.getTime())) return toText(value, 'N/A');
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

// Load an image URL and return a base64 data URL
const loadImageAsBase64 = (src: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

// Load a font file and return ArrayBuffer
const loadFontAsArrayBuffer = async (url: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
};

// Convert ArrayBuffer to base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Register NotoSans font with jsPDF for ₹ symbol support
const registerNotoSans = async (doc: jsPDF): Promise<boolean> => {
  try {
    const [regularBuf, boldBuf] = await Promise.all([
      loadFontAsArrayBuffer('/fonts/NotoSans-Regular.ttf'),
      loadFontAsArrayBuffer('/fonts/NotoSans-Bold.ttf'),
    ]);

    if (regularBuf) {
      const regularBase64 = arrayBufferToBase64(regularBuf);
      doc.addFileToVFS('NotoSans-Regular.ttf', regularBase64);
      doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    }
    if (boldBuf) {
      const boldBase64 = arrayBufferToBase64(boldBuf);
      doc.addFileToVFS('NotoSans-Bold.ttf', boldBase64);
      doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');
    }
    return !!(regularBuf && boldBuf);
  } catch {
    return false;
  }
};

const addBackground = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, PAGE_WIDTH, pageHeight, 'F');

  doc.setFillColor(...colors.gold);
  doc.rect(0, 0, PAGE_WIDTH, 2.2, 'F');

  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.7);
  doc.line(8, 8, 20, 8);
  doc.line(8, 8, 8, 20);
  doc.line(PAGE_WIDTH - 20, 8, PAGE_WIDTH - 8, 8);
  doc.line(PAGE_WIDTH - 8, 8, PAGE_WIDTH - 8, 20);
};

const drawHeader = (doc: jsPDF, order: InvoiceOrder, logoData: string | null) => {
  doc.setFillColor(...colors.panel);
  doc.rect(0, 2.2, PAGE_WIDTH, 46, 'F');

  // Logo
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', LEFT, 6, 18, 18);
    } catch { /* skip if fails */ }
  }

  const textStart = logoData ? LEFT + 22 : LEFT;

  doc.setFont(FONT, 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...colors.gold);
  doc.text('VELOCITY', textStart, 20);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.dim);
  doc.text('L U X U R Y   S U P E R C A R S   I N D I A', textStart, 27);

  // Gold accent bar
  doc.setFillColor(...colors.gold);
  doc.rect(textStart, 30, 28, 1, 'F');

  // Invoice badge
  doc.setFillColor(...colors.panelSoft);
  doc.roundedRect(PAGE_WIDTH - 74, 8, 58, 32, 3, 3, 'F');
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.45);
  doc.roundedRect(PAGE_WIDTH - 74, 8, 58, 32, 3, 3, 'S');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.gold);
  doc.text('TAX INVOICE', PAGE_WIDTH - 45, 18, { align: 'center' });

  doc.setFont(FONT, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...colors.goldSoft);
  doc.text(toText(order.order_number, 'N/A'), PAGE_WIDTH - 45, 24, { align: 'center' });

  doc.setTextColor(...colors.muted);
  doc.text(formatDate(order.created_at), PAGE_WIDTH - 45, 30, { align: 'center' });

  // Bottom separator
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.4);
  doc.line(LEFT, 52, RIGHT, 52);
};

const drawInfoBox = (
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  title: string,
  lines: string[],
) => {
  const boxH = 36;
  doc.setFillColor(...colors.panel);
  doc.roundedRect(x, y, w, boxH, 3, 3, 'F');
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, boxH, 3, 3, 'S');

  doc.setFillColor(...colors.gold);
  doc.rect(x, y + 3, 2.2, boxH - 6, 'F');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...colors.gold);
  doc.text(title, x + 7, y + 6);

  let lineY = y + 11;
  lines.forEach((raw, index) => {
    const wrapped = doc.splitTextToSize(toText(raw), w - 12);
    doc.setFont(FONT, index === 0 ? 'bold' : 'normal');
    doc.setFontSize(index === 0 ? 7.5 : 7);
    doc.setTextColor(...(index === 0 ? colors.text : colors.muted));
    wrapped.slice(0, 2).forEach((line: string) => {
      doc.text(line, x + 7, lineY);
      lineY += index === 0 ? 5 : 4.5;
    });
  });
};

const drawCustomerAndPayment = (doc: jsPDF, order: InvoiceOrder): number => {
  const sectionTop = 58;
  const boxGap = 6;
  const boxW = (CONTENT_WIDTH - boxGap) / 2;

  drawInfoBox(doc, LEFT, sectionTop, boxW, 'BILL TO', [
    order.shipping_name,
    order.shipping_email,
    order.shipping_phone,
  ]);

  drawInfoBox(doc, LEFT + boxW + boxGap, sectionTop, boxW, 'SHIP TO', [
    order.shipping_address,
    `${toText(order.shipping_city)}, ${toText(order.shipping_state)}`,
    `PIN: ${toText(order.shipping_pincode)}`,
  ]);

  const paymentY = sectionTop + 40;
  doc.setFillColor(...colors.panelSoft);
  doc.roundedRect(LEFT, paymentY, 72, 13, 3, 3, 'F');
  doc.setDrawColor(...colors.gold);
  doc.roundedRect(LEFT, paymentY, 72, 13, 3, 3, 'S');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.dim);
  doc.text('PAYMENT METHOD', LEFT + 6, paymentY + 8);

  doc.setFontSize(8);
  doc.setTextColor(...colors.text);
  doc.text(toText(order.payment_method, 'N/A').toUpperCase(), LEFT + 38, paymentY + 8);

  return paymentY + 20;
};

const drawItems = (
  doc: jsPDF,
  startY: number,
  items: InvoiceItem[],
  carImages: Map<number, string>,
): number => {
  const safeItems = items.length ? items : [{ quantity: 1 } as InvoiceItem];

  const rows = safeItems.map((item, idx) => {
    const name = toText(item.car?.name || item.car_name || 'Vehicle');
    const brand = toText(item.car?.brand || item.car_brand || '-');
    const unit = toNumber(item.car?.price ?? item.price);
    const qty = Math.max(1, Math.floor(toNumber(item.quantity)));

    return [
      String(idx + 1).padStart(2, '0'),
      '', // image placeholder column
      name,
      brand,
      String(qty),
      formatMoney(unit),
      formatMoney(unit * qty),
    ];
  });

  autoTable(doc, {
    startY,
    head: [['NO.', '', 'VEHICLE', 'BRAND', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: rows,
    theme: 'plain',
    margin: { left: LEFT, right: PAGE_WIDTH - RIGHT },
    styles: {
      font: FONT,
      fontSize: 7.5,
      textColor: [...colors.text],
      lineColor: [...colors.border],
      lineWidth: 0.15,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      overflow: 'linebreak',
      minCellHeight: 13,
    },
    headStyles: {
      fillColor: [...colors.panelSoft],
      textColor: [...colors.gold],
      fontStyle: 'bold',
      fontSize: 6,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [...colors.rowAlt],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10, textColor: [...colors.goldSoft], fontStyle: 'bold' },
      1: { cellWidth: 16 }, // image column
      2: { cellWidth: 42, fontStyle: 'bold' },
      3: { cellWidth: 24, textColor: [...colors.muted] },
      4: { halign: 'center', cellWidth: 10 },
      5: { halign: 'right', cellWidth: 32 },
      6: { halign: 'right', cellWidth: 32, textColor: [...colors.goldSoft], fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      // Draw car image in column 1 (body rows only)
      if (data.section === 'body' && data.column.index === 1) {
        const imgData = carImages.get(data.row.index);
        if (imgData) {
          try {
            const imgSize = 10;
            const x = data.cell.x + (data.cell.width - imgSize) / 2;
            const y = data.cell.y + (data.cell.height - imgSize) / 2;
            doc.setFillColor(...colors.panelSoft);
            doc.roundedRect(x - 0.5, y - 0.5, imgSize + 1, imgSize + 1, 2, 2, 'F');
            doc.addImage(imgData, 'JPEG', x, y, imgSize, imgSize);
          } catch { /* skip */ }
        }
      }
    },
  });

  return (doc as any).lastAutoTable?.finalY || startY + 30;
};

const FOOTER_HEIGHT = 22;

const drawTotals = (doc: jsPDF, order: InvoiceOrder, fromY: number): number => {
  const pageHeight = doc.internal.pageSize.height;
  const hasDiscount = toNumber(order.discount) > 0;
  const cardHeight = hasDiscount ? 42 : 36;

  let y = fromY + 6;
  if (y + cardHeight + 80 > pageHeight) {
    doc.addPage();
    addBackground(doc);
    y = 20;
  }

  doc.setFont(FONT, 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...colors.dim);
  doc.text('* All prices are shown in Indian Rupees', LEFT, y + 3);
  doc.text('* GST charged at 28% as applicable', LEFT, y + 7);

  const cardX = 120;
  const cardW = RIGHT - cardX;

  doc.setFillColor(...colors.panel);
  doc.roundedRect(cardX, y - 1, cardW, cardHeight, 3, 3, 'F');
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, y - 1, cardW, cardHeight, 3, 3, 'S');

  doc.setFillColor(...colors.gold);
  doc.rect(cardX + 6, y - 1, cardW - 12, 1.2, 'F');

  let lineY = y + 6;
  const row = (label: string, value: string, opts?: { bold?: boolean; accent?: boolean }) => {
    const bold = opts?.bold || false;
    const accent = opts?.accent || false;
    doc.setFont(FONT, bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 9 : 7.5);
    doc.setTextColor(...(bold ? colors.text : accent ? colors.gold : colors.muted));
    doc.text(label, cardX + 6, lineY);
    doc.setTextColor(...(bold ? colors.gold : accent ? colors.goldSoft : colors.text));
    doc.text(value, cardX + cardW - 6, lineY, { align: 'right' });
    lineY += bold ? 0 : 7.5;
  };

  row('Subtotal', formatMoney(order.subtotal));
  row('GST (28%)', formatMoney(order.gst_amount), { accent: true });
  if (hasDiscount) row('Discount', `- ${formatMoney(order.discount)}`);

  lineY += 1;
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.3);
  doc.line(cardX + 6, lineY, cardX + cardW - 6, lineY);
  lineY += 5;

  row('GRAND TOTAL', formatMoney(order.total), { bold: true });

  return y + cardHeight;
};

const drawSignatory = (doc: jsPDF, afterY: number): number => {
  const pageHeight = doc.internal.pageSize.height;
  const sectionHeight = 38;

  let y = afterY + 8;
  if (y + sectionHeight + FOOTER_HEIGHT + 6 > pageHeight) {
    doc.addPage();
    addBackground(doc);
    y = 20;
  }

  // Signatory box — right side
  const sigX = 126;
  const sigW = RIGHT - sigX;

  doc.setFillColor(...colors.panel);
  doc.roundedRect(sigX, y, sigW, sectionHeight, 3, 3, 'F');
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.25);
  doc.roundedRect(sigX, y, sigW, sectionHeight, 3, 3, 'S');

  doc.setFillColor(...colors.gold);
  doc.rect(sigX + 6, y, sigW - 12, 1, 'F');

  doc.setFont(FONT, 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...colors.muted);
  doc.text('For VELOCITY SUPERCARS PVT. LTD.', sigX + sigW / 2, y + 6, { align: 'center' });

  // Signature strokes
  const lineStartX = sigX + 10;
  const lineEndX = sigX + sigW - 10;
  const sigLineY = y + 22;
  const midX = (lineStartX + lineEndX) / 2;

  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.5);
  doc.line(lineStartX + 2, sigLineY - 1, midX - 6, sigLineY - 4);
  doc.line(midX - 6, sigLineY - 4, midX, sigLineY);
  doc.line(midX, sigLineY, midX + 5, sigLineY - 5);
  doc.line(midX + 5, sigLineY - 5, lineEndX - 6, sigLineY - 2);

  doc.setDrawColor(...colors.dim);
  doc.setLineWidth(0.2);
  doc.line(lineStartX, sigLineY + 2, lineEndX, sigLineY + 2);

  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...colors.goldSoft);
  doc.text('Rajesh Sharma', sigX + sigW / 2, sigLineY + 8, { align: 'center' });

  doc.setFont(FONT, 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...colors.dim);
  doc.text('Authorized Signatory  |  Managing Director', sigX + sigW / 2, sigLineY + 12, { align: 'center' });

  // Left side — terms + seal
  doc.setFont(FONT, 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...colors.dim);
  doc.text('This is a computer-generated invoice.', LEFT, y + 6);
  doc.text('No physical signature is required.', LEFT, y + 10);
  doc.text('E. & O.E.', LEFT, y + 17);

  // Seal
  const sealX = LEFT + 26;
  const sealY = y + 28;
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(0.4);
  doc.circle(sealX, sealY, 6.5, 'S');
  doc.setLineWidth(0.25);
  doc.circle(sealX, sealY, 5.2, 'S');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(4);
  doc.setTextColor(...colors.gold);
  doc.text('VELOCITY', sealX, sealY - 1, { align: 'center' });
  doc.setFontSize(3);
  doc.text('SUPERCARS', sealX, sealY + 1.5, { align: 'center' });
  doc.setFont(FONT, 'normal');
  doc.setFontSize(2.5);
  doc.setTextColor(...colors.dim);
  doc.text('SEALED', sealX, sealY + 3.5, { align: 'center' });

  return y + sectionHeight;
};

const drawFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - FOOTER_HEIGHT;

  doc.setFillColor(...colors.panel);
  doc.rect(0, footerY, PAGE_WIDTH, FOOTER_HEIGHT, 'F');

  doc.setFillColor(...colors.gold);
  doc.rect(0, footerY, PAGE_WIDTH, 1, 'F');

  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...colors.gold);
  doc.text('VELOCITY SUPERCARS PVT. LTD.', PAGE_WIDTH / 2, footerY + 5.5, { align: 'center' });

  doc.setFont(FONT, 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...colors.dim);
  doc.text('GSTIN: 27AADCV1234A1ZB  |  CIN: U34100MH2024PTC123456', PAGE_WIDTH / 2, footerY + 10, { align: 'center' });
  doc.text('Dharampeth, Nagpur, Maharashtra 440010  |  +91 98765 43210  |  info@velocity.in', PAGE_WIDTH / 2, footerY + 14, { align: 'center' });

  doc.setTextColor(...colors.goldSoft);
  doc.setFontSize(5.5);
  doc.text('Thank you for choosing Velocity. Drive the extraordinary.', PAGE_WIDTH / 2, footerY + 19, { align: 'center' });
};

export const generateInvoicePDF = async (order: InvoiceOrder, items: InvoiceItem[]) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Register custom font for ₹ symbol support + load images in parallel
  const [fontLoaded, logoData, ...carResults] = await Promise.all([
    registerNotoSans(doc),
    loadImageAsBase64(velocityLogo),
    ...(items || []).map((item, idx) => {
      const imgSrc = item.car_image || item.car?.image || '';
      if (!imgSrc) return Promise.resolve({ idx, data: null });
      return loadImageAsBase64(imgSrc).then((data) => ({ idx, data }));
    }),
  ]);

  // Set global font variable for all drawing functions
  FONT = fontLoaded ? 'NotoSans' : 'helvetica';
  doc.setFont(FONT, 'normal');

  const carImages = new Map<number, string>();
  carResults.forEach((result) => {
    if (result && result.data) {
      carImages.set(result.idx, result.data);
    }
  });

  addBackground(doc);
  drawHeader(doc, order, logoData);
  const startY = drawCustomerAndPayment(doc, order);
  const finalTableY = drawItems(doc, startY, items, carImages);
  const totalsEndY = drawTotals(doc, order, finalTableY);
  drawSignatory(doc, totalsEndY);
  drawFooter(doc);

  doc.save(`Velocity-Invoice-${toText(order.order_number, 'ORDER')}.pdf`);
};
