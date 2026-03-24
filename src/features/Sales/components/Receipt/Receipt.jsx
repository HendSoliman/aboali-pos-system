import React, { useRef } from 'react';
import styles from './Receipt.module.css';

// ─── Helpers ────────────────────────────────────────────────────────────────
const pad   = (n)    => String(n).padStart(2, '0');
const fmtDate = (d)  => {
  try {
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt)) throw new Error();
    return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}  ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  } catch { return '—'; }
};
const fmtNum  = (n)  => {
  const v = parseFloat(n);
  return isNaN(v) ? '0.00' : v.toFixed(2);
};
const genInvoice = () => `INV-${Date.now().toString(36).toUpperCase()}`;

// ─── Receipt Component ───────────────────────────────────────────────────────
export default function Receipt({ isOpen, onClose, orderData }) {
  const printRef = useRef(null);

  // ── Early exit (after hooks) ────────────────────────────────────────────
  if (!isOpen) return null;

  // ── Safe-extract everything with defaults ───────────────────────────────
  const {
    items        = [],
    subtotal     = 0,
    discount     = 0,
    tax          = 0,
    total        = 0,
    paymentMethod= 'نقدي',
    amountPaid   = 0,
    change       = 0,
    cashierName  = 'البائع',
    storeName    = 'نقطة البيع',
    invoiceNumber= genInvoice(),
    date         = new Date(),
  } = orderData ?? {};

  // ── Sanitise items array — filter out any undefined/null elements ───────
  const safeItems = Array.isArray(items)
    ? items.filter(item => item != null && typeof item === 'object')
    : [];

  // ── Print handler ───────────────────────────────────────────────────────
  const handlePrint = () => {
    const content = printRef.current?.innerHTML ?? '';
    const win = window.open('', '_blank', 'width=420,height=700');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>فاتورة - ${invoiceNumber}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet"/>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Cairo',sans-serif; background:#fff; color:#111; direction:rtl; padding:20px; }
          h1 { font-size:18px; font-weight:800; text-align:center; margin-bottom:4px; }
          p  { font-size:12px; color:#555; text-align:center; margin-bottom:2px; }
          hr { border:none; border-top:1px dashed #ccc; margin:10px 0; }
          table { width:100%; border-collapse:collapse; font-size:12px; }
          th,td { padding:5px 2px; }
          th { font-weight:700; border-bottom:1px dashed #ccc; }
          .total-row td { font-weight:800; font-size:14px; padding-top:8px; border-top:1px dashed #ccc; }
          .lbl { color:#666; }
          .center { text-align:center; }
          .green  { color:#059669; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  // ── Calculated values (safe) ────────────────────────────────────────────
  const safeSubtotal = parseFloat(subtotal) || safeItems.reduce((s, it) => {
    const price = parseFloat(it.price ?? it.unitPrice ?? 0);
    const qty   = parseFloat(it.quantity ?? it.qty ?? 1);
    return s + price * qty;
  }, 0);

  const safeDiscount   = parseFloat(discount)   || 0;
  const safeTax        = parseFloat(tax)         || 0;
  const safeTotal      = parseFloat(total)       || (safeSubtotal - safeDiscount + safeTax);
  const safeAmountPaid = parseFloat(amountPaid)  || safeTotal;
  const safeChange     = parseFloat(change)      || Math.max(0, safeAmountPaid - safeTotal);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={styles.container}>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <span className={styles.toolbarTitle}>🧾 الفاتورة</span>
          <div className={styles.toolbarActions}>
            <button className={styles.printBtn} onClick={handlePrint}>
              🖨️ طباعة
            </button>
            <button className={styles.closeBtn} onClick={() => onClose?.()}>✕</button>
          </div>
        </div>

        {/* ── Scrollable Receipt ── */}
        <div className={styles.receiptWrapper}>
          <div className={styles.receipt} ref={printRef}>

            {/* Store Header */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div className={styles.storeIcon}>🏪</div>
              <div className={styles.storeName}>{storeName}</div>
              <div className={styles.storeMeta}>
                <span>📞 ٠١٢٨٢٧٢٣٣٢٦</span>
                <span>📍 مجاورة ٢٢ - مدينة ١٥ مايو </span>
              </div>
            </div>

            <hr className={styles.dashed} />

            {/* Invoice Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div className={styles.metaCol}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>رقم الفاتورة</span>
                <span style={{ fontSize: 13, color: '#f3f4f6', fontWeight: 700 }}>{invoiceNumber}</span>
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>الكاشير</span>
                <span style={{ fontSize: 12, color: '#d1d5db' }}>{cashierName}</span>
              </div>
              <div className={`${styles.metaCol} ${styles.metaColRight}`}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>التاريخ والوقت</span>
                <span style={{ fontSize: 12, color: '#d1d5db' }}>{fmtDate(date)}</span>
                <span style={{ marginTop: 6 }}>
                  <span className={styles.paidBadge}>✔ مدفوعة</span>
                </span>
              </div>
            </div>

            <hr className={styles.dashed} />

            {/* Items Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: '0 8px',
              padding: '6px 0',
              fontSize: 11,
              color: '#6b7280',
              borderBottom: '1px dashed #374151',
              marginBottom: 6,
            }}>
              <span>الصنف</span>
              <span style={{ textAlign: 'center' }}>الكمية</span>
              <span style={{ textAlign: 'center' }}>السعر</span>
              <span style={{ textAlign: 'left' }}>الإجمالي</span>
            </div>

            {/* Items — fully null-safe */}
            {safeItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, padding: '16px 0' }}>
                لا توجد أصناف
              </div>
            ) : (
              safeItems.map((item, idx) => {
                // ── null-safe field extraction ──
                const itemId    = item.id    ?? item._id   ?? idx;
                const itemName  = item.name  ?? item.title ?? `صنف ${idx + 1}`;
                const itemEmoji = item.emoji ?? '📦';
                const itemPrice = parseFloat(item.price ?? item.unitPrice ?? 0);
                const itemQty   = parseFloat(item.quantity ?? item.qty ?? 1);
                const itemUnit  = item.unit  ?? item.unitLabel ?? null;
                const itemTotal = itemPrice * itemQty;

                return (
                  <div key={`${itemId}-${idx}`} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    gap: '0 8px',
                    padding: '7px 0',
                    borderBottom: '1px solid #1f2937',
                    alignItems: 'center',
                  }}>
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{itemEmoji}</span>
                      <div>
                        <div style={{ fontSize: 12, color: '#f3f4f6', fontWeight: 600 }}>{itemName}</div>
                        {itemUnit && (
                          <div style={{ fontSize: 10, color: '#10b981' }}>⚖️ {itemUnit}</div>
                        )}
                      </div>
                    </div>
                    {/* Qty */}
                    <span style={{ fontSize: 12, color: '#d1d5db', textAlign: 'center' }}>
                      {itemQty % 1 === 0 ? itemQty : itemQty.toFixed(3)}
                    </span>
                    {/* Unit Price */}
                    <span style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                      {fmtNum(itemPrice)}
                    </span>
                    {/* Line Total */}
                    <span style={{ fontSize: 13, color: '#34d399', textAlign: 'left', fontWeight: 700 }}>
                      {fmtNum(itemTotal)}
                    </span>
                  </div>
                );
              })
            )}

            {/* Totals */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>المجموع الفرعي</span>
                <span>{fmtNum(safeSubtotal)} ج.م</span>
              </div>
              {safeDiscount > 0 && (
                <div className={`${styles.totalRow} ${styles.discount}`}>
                  <span>الخصم</span>
                  <span>- {fmtNum(safeDiscount)} ج.م</span>
                </div>
              )}
              {safeTax > 0 && (
                <div className={styles.totalRow}>
                  <span>الضريبة (15%)</span>
                  <span>{fmtNum(safeTax)} ج.م</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>🏷️ الإجمالي</span>
                <span>{fmtNum(safeTotal)} ج.م</span>
              </div>
              <div className={styles.totalRow}>
                <span>💳 طريقة الدفع</span>
                <span style={{ color: '#60a5fa' }}>{paymentMethod}</span>
              </div>
              {safeAmountPaid > 0 && (
                <div className={styles.totalRow}>
                  <span>المبلغ المدفوع</span>
                  <span>{fmtNum(safeAmountPaid)} ج.م</span>
                </div>
              )}
              {safeChange > 0 && (
                <div className={styles.totalRow}>
                  <span>الباقي</span>
                  <span style={{ color: '#fbbf24' }}>{fmtNum(safeChange)} ج.م</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.receiptFooter}>
              <div>شكراً لزيارتكم 🙏</div>
              <div>نتمنى لكم تجربة تسوق ممتازة</div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#4b5563' }}>
                للاستفسار: support@pos.sa
              </div>
              <div className={styles.footerDots}>• • • • • • •</div>
            </div>

          </div>{/* /receipt */}
        </div>{/* /receiptWrapper */}
      </div>{/* /container */}
    </div>
  );
}