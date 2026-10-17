import jsPDF from "jspdf";

/* ═══════════════════════════════════════════ */
/* 🎯 PROFESSIONAL ORDER PDF GENERATOR        */
/* ═══════════════════════════════════════════ */

export function generateOrderPDF(order, settings) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const rawCurrency = settings?.currency || "৳";
  const currency = rawCurrency === "৳" ? "BDT" : rawCurrency;
  const siteName = settings?.siteName || "My Shop";
  const tagline = settings?.tagline || "Quality Products Online";

  // 📐 LAYOUT CONSTANTS — precise mm values
  const PAGE_W = doc.internal.pageSize.getWidth(); // 210
  const PAGE_H = doc.internal.pageSize.getHeight(); // 297
  const MARGIN = 15;
  const CONTENT_W = PAGE_W - MARGIN * 2; // 180

  // Colors
  const GREEN = [16, 185, 129];
  const BLUE = [59, 130, 246];
  const DARK = [15, 23, 42];
  const GRAY = [100, 116, 139];
  const LIGHT_GRAY = [241, 245, 249];
  const WHITE = [255, 255, 255];
  const BORDER_GRAY = [226, 232, 240];

  let y = 0;

  /* ═══════════════════════════════════════════ */
  /* 🎨 HEADER (Full width green bar)            */
  /* ═══════════════════════════════════════════ */
  const HEADER_H = 38;
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");

  // Site name (left)
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(siteName, MARGIN, 17);

  // Tagline (left below)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(tagline, MARGIN, 24);

  // INVOICE label (right)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", PAGE_W - MARGIN, 12, { align: "right" });

  // Order ID (right)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(order.id, PAGE_W - MARGIN, 22, { align: "right" });

  // Date (right)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const orderDate = new Date(order.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(orderDate, PAGE_W - MARGIN, 29, { align: "right" });

  y = HEADER_H + 12;

  /* ═══════════════════════════════════════════ */
  /* 👤 BILL TO + 📋 ORDER INFO — 2 columns      */
  /* ═══════════════════════════════════════════ */
  const COL_LEFT_X = MARGIN;
  const COL_RIGHT_X = PAGE_W / 2 + 5;
  const COL_WIDTH = PAGE_W / 2 - MARGIN - 5;

  // ─── LEFT: BILL TO ───
  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", COL_LEFT_X, y);

  let leftY = y + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...DARK);

  // Name
  doc.text(order.name || "N/A", COL_LEFT_X, leftY);
  leftY += 6;

  // Phone
  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  doc.text("Phone:", COL_LEFT_X, leftY);
  doc.setTextColor(...DARK);
  doc.text(order.phone || "N/A", COL_LEFT_X + 15, leftY);
  leftY += 5;

  // Address label
  doc.setTextColor(...GRAY);
  doc.text("Address:", COL_LEFT_X, leftY);
  doc.setTextColor(...DARK);

  // Address value with wrapping
  const addressText = order.address || "N/A";
  const addressLines = doc.splitTextToSize(
    addressText,
    COL_WIDTH - 20
  );
  doc.text(addressLines, COL_LEFT_X + 15, leftY);
  leftY += addressLines.length * 5;

  // ─── RIGHT: ORDER INFO ───
  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER INFO", COL_RIGHT_X, y);

  let rightY = y + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Row 1: Status
  doc.setTextColor(...GRAY);
  doc.text("Status:", COL_RIGHT_X, rightY);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(
    (order.status || "pending").toUpperCase(),
    COL_RIGHT_X + 22,
    rightY
  );
  rightY += 6;

  // Row 2: Method
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Method:", COL_RIGHT_X, rightY);
  doc.setTextColor(...DARK);
  doc.text(
    order.method === "whatsapp" ? "WhatsApp" : "Website",
    COL_RIGHT_X + 22,
    rightY
  );
  rightY += 6;

  // Row 3: Payment
  doc.setTextColor(...GRAY);
  doc.text("Payment:", COL_RIGHT_X, rightY);
  doc.setTextColor(...DARK);
  doc.text(getPaymentLabel(order.paymentMethod), COL_RIGHT_X + 22, rightY);

  y = Math.max(leftY, rightY) + 12;

  /* ═══════════════════════════════════════════ */
  /* 📦 ITEMS TABLE                              */
  /* ═══════════════════════════════════════════ */
  
  // Column positions (in mm from left)
  const COL_NUM_X = MARGIN + 3;
  const COL_ITEM_X = MARGIN + 10;
  const COL_PRICE_RIGHT = PAGE_W - MARGIN - 55;
  const COL_QTY_RIGHT = PAGE_W - MARGIN - 28;
  const COL_TOTAL_RIGHT = PAGE_W - MARGIN - 3;

  // Table header background
  const ROW_H = 9;
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(MARGIN, y - 5, CONTENT_W, ROW_H, "F");

  // Header text
  doc.setTextColor(...GREEN);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  doc.text("#", COL_NUM_X, y);
  doc.text("ITEM", COL_ITEM_X, y);
  doc.text("PRICE", COL_PRICE_RIGHT, y, { align: "right" });
  doc.text("QTY", COL_QTY_RIGHT, y, { align: "right" });
  doc.text("TOTAL", COL_TOTAL_RIGHT, y, { align: "right" });

  y += ROW_H;

  /* ═══ ITEM ROWS ═══ */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  order.items.forEach((item, i) => {
    // Page break check
    if (y > PAGE_H - 80) {
      doc.addPage();
      y = MARGIN + 5;
    }

    // Alternating row background
    const rowBgY = y - 5;
    if (i % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(MARGIN, rowBgY, CONTENT_W, ROW_H, "F");
    }

    // Row content
    const itemNameLines = doc.splitTextToSize(
      item.name || "N/A",
      COL_PRICE_RIGHT - COL_ITEM_X - 5
    );

    doc.setTextColor(...DARK);
    doc.text(String(i + 1), COL_NUM_X, y);
    doc.text(itemNameLines, COL_ITEM_X, y);

    doc.text(`${currency} ${item.price}`, COL_PRICE_RIGHT, y, {
      align: "right",
    });
    doc.text(String(item.quantity), COL_QTY_RIGHT, y, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(
      `${currency} ${item.price * item.quantity}`,
      COL_TOTAL_RIGHT,
      y,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");

    // Row height based on item name lines
    const lineHeight = Math.max(itemNameLines.length * 5, ROW_H);
    y += lineHeight;
  });

  // Bottom border of table
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 3, PAGE_W - MARGIN, y - 3);

  y += 10;

  /* ═══════════════════════════════════════════ */
  /* 💰 SUMMARY — Right aligned box             */
  /* ═══════════════════════════════════════════ */

  // Check if summary fits
  if (y > PAGE_H - 70) {
    doc.addPage();
    y = MARGIN + 10;
  }

  // Summary box dimensions
  const SUMMARY_W = 80;
  const SUMMARY_X = PAGE_W - MARGIN - SUMMARY_W;

  // ─── Subtotal ───
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Subtotal", SUMMARY_X, y);
  doc.setTextColor(...DARK);
  doc.text(`${currency} ${order.subtotal}`, PAGE_W - MARGIN, y, {
    align: "right",
  });
  y += 7;

  // ─── Delivery ───
  doc.setTextColor(...GRAY);
  doc.text("Delivery", SUMMARY_X, y);
  doc.setTextColor(...DARK);
  doc.text(
    `${currency} ${order.delivery || 60}`,
    PAGE_W - MARGIN,
    y,
    { align: "right" }
  );
  y += 7;

  // ─── Discount (if any) ───
  if (order.couponDiscount > 0) {
    doc.setTextColor(...GREEN);
    doc.text(
      `Discount (${order.couponCode || "Applied"})`,
      SUMMARY_X,
      y
    );
    doc.text(
      `- ${currency} ${order.couponDiscount}`,
      PAGE_W - MARGIN,
      y,
      { align: "right" }
    );
    y += 7;
  }

  // ─── Divider line ───
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(SUMMARY_X, y - 2, PAGE_W - MARGIN, y - 2);

  y += 4;

  // ─── TOTAL — Highlighted bar ───
  const TOTAL_BAR_H = 11;
  const TOTAL_BAR_Y = y - 4;
  
  // Full-width total bar (nicer look)
  doc.setFillColor(...GREEN);
  doc.rect(SUMMARY_X, TOTAL_BAR_Y, SUMMARY_W, TOTAL_BAR_H, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", SUMMARY_X + 4, y + 3);
  doc.setFontSize(13);
  doc.text(
    `${currency} ${order.total}`,
    PAGE_W - MARGIN - 4,
    y + 3,
    { align: "right" }
  );

  y += TOTAL_BAR_H + 5;

  /* ═══════════════════════════════════════════ */
  /* 💬 NOTES SECTION (if order has note)        */
  /* ═══════════════════════════════════════════ */
  if (order.note && order.note.trim()) {
    if (y > PAGE_H - 60) {
      doc.addPage();
      y = MARGIN + 10;
    }

    doc.setDrawColor(...BORDER_GRAY);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6;

    doc.setTextColor(...GRAY);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("NOTE", MARGIN, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const noteLines = doc.splitTextToSize(
      order.note,
      CONTENT_W
    );
    doc.text(noteLines, MARGIN, y);
    y += noteLines.length * 5;
  }

  /* ═══════════════════════════════════════════ */
  /* 🦶 FOOTER                                   */
  /* ═══════════════════════════════════════════ */
  
  // Footer divider line
  doc.setDrawColor(...BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 25, PAGE_W - MARGIN, PAGE_H - 25);

  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  // Thank you
  doc.text(
    `Thank you for shopping with ${siteName}!`,
    PAGE_W / 2,
    PAGE_H - 18,
    { align: "center" }
  );

  // Contact
  const contactParts = [];
  if (settings?.phone) contactParts.push(settings.phone);
  if (settings?.email) contactParts.push(settings.email);
  const contactText = contactParts.join("  •  ");
  if (contactText) {
    doc.text(contactText, PAGE_W / 2, PAGE_H - 13, { align: "center" });
  }

  // Address
  if (settings?.address) {
    doc.text(settings.address, PAGE_W / 2, PAGE_H - 8, {
      align: "center",
    });
  }

  // Save
  doc.save(`invoice-${order.id}.pdf`);
}

/* ═══════════════════════════════════════════ */
/* 🎯 Get payment method label                 */
/* ═══════════════════════════════════════════ */
function getPaymentLabel(method) {
  const labels = {
    cod: "Cash on Delivery",
    bkash: "bKash",
    nagad: "Nagad",
    card: "Card",
  };
  return labels[method] || "Cash on Delivery";
}

/* ═══════════════════════════════════════════ */
/* 🎯 WISHLIST PDF (Optional)                  */
/* ═══════════════════════════════════════════ */
export function generateWishlistPDF(products, settings) {
  const doc = new jsPDF();
  const rawCurrency = settings?.currency || "৳";
  const currency = rawCurrency === "৳" ? "BDT" : rawCurrency;
  const siteName = settings?.siteName || "My Shop";
  const PAGE_W = doc.internal.pageSize.getWidth();

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, PAGE_W, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`${siteName} - Wishlist`, 15, 20);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let y = 45;
  products.forEach((p, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${i + 1}. ${p.name}`, 15, y);
    doc.text(`${currency} ${p.price}`, 180, y, { align: "right" });
    y += 7;
  });

  doc.save(`wishlist-${Date.now()}.pdf`);
}