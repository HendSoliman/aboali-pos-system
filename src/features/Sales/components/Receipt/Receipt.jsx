// src/features/Sales/components/Receipt.jsx
import React, { useRef } from 'react';
import { X, Printer, MapPin, Phone, CheckCircle, Package } from 'lucide-react';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatDate = (input) => {
  try {
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return String(input ?? '—');
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time}  ${date}`;
  } catch {
    return String(input ?? '—');
  }
};

const fmt = (n) => `${Number(n || 0).toFixed(2)} ج.م`;

const getPaymentLabel = (method) => {
  if (!method) return 'نقدي';
  const m = String(method).toUpperCase();
  if (m === 'CASH')   return '💵 نقدي';
  if (m === 'CARD')   return '💳 بطاقة';
  return method; // already Arabic or unknown
};

const getItemName = (item, index) =>
  item.nameAr || item.productNameAr || item.productName || item.name || `صنف ${index + 1}`;

const getItemQty = (item) => {
  if (item.isLoose && item.unit) {
    return `${Number(item.quantity || 0).toFixed(2)} ${item.unit}`;
  }
  return String(item.quantity ?? 1);
};

const getItemSubtotal = (item) => {
  if (item.totalPrice != null) return Number(item.totalPrice);
  const qty   = Number(item.quantity  || 1);
  const price = Number(item.unitPrice || item.price || 0);
  return qty * price;
};

/* ─────────────────────────────────────────────
   Print styles injected into the popup window
───────────────────────────────────────────── */
const PRINT_STYLES = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    background:#fff; color:#111;
    padding:16px; width:320px; margin:0 auto; direction:rtl;
  }
  .dashed { border-top:1px dashed #aaa; margin:10px 0; }
  .center { text-align:center; }
  .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:8px 0; }
  .meta-label { font-size:10px; color:#888; }
  .meta-val   { font-size:12px; font-weight:700; }
  .green      { color:#16a34a; }
  .badge      { background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
  .items-header {
    display:grid; grid-template-columns:1fr 44px 54px 62px;
    gap:4px; font-size:10px; color:#888; font-weight:600; margin:6px 0 4px;
  }
  .item-row {
    display:grid; grid-template-columns:1fr 44px 54px 62px;
    gap:4px; font-size:11px; padding:5px 0; border-bottom:1px solid #f0f0f0; align-items:center;
  }
  .total-row { display:flex; justify-content:space-between; font-size:12px; margin:4px 0; color:#555; }
  .grand     { font-size:15px; font-weight:800; color:#111; background:#f9fafb; padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; }
  .footer    { text-align:center; color:#888; font-size:11px; line-height:1.8; margin-top:8px; }
`;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const Receipt = ({ isOpen, orderData, onClose, settings = {} }) => {
  const printRef = useRef();

  /* ── Guards ── */
  if (!isOpen || !orderData) return null;

  /* ── Store info: prefer settings, then orderData, then hard defaults ── */
  const storeName    = settings.store_name    || settings.storeName    || orderData.storeName    || 'علافة وعطارة الحاج أبو علي';
  const storePhone   = settings.store_phone   || settings.storePhone   || orderData.storePhone   || '٠١٢٨٢٧٢٣٢٦';
  const storeAddress = settings.store_address || settings.storeAddress || orderData.storeAddress || 'مجاورة ٢٢ - مدينة ١٥ مايو';
  const receiptFooter= settings.receipt_footer|| settings.receiptFooter|| 'شكراً لزيارتكم، نتمنى لكم تجربة تسوق ممتازة';

  /* ── Order data ── */
  const items         = orderData.items        || orderData.orderItems  || [];
  const subtotal      = Number(orderData.subtotal     ?? orderData.subTotal    ?? items.reduce((s, i) => s + getItemSubtotal(i), 0));
  const discount      = Number(orderData.discount     ?? orderData.discountAmount ?? 0);
  const tax           = Number(orderData.tax          ?? orderData.taxAmount      ?? 0);
  const total         = Number(orderData.total        ?? orderData.totalAmount    ?? subtotal + tax - discount);
  const paymentMethod = orderData.paymentMethod || orderData.payment_method || 'CASH';
  const orderNumber   = orderData.orderNumber   || orderData.receiptNumber || orderData.id || '—';
  const createdAt     = orderData.createdAt     || orderData.date || new Date().toISOString();
  const paidAmount    = Number(orderData.paidAmount   ?? orderData.amountPaid  ?? total);
  const change        = Number(orderData.change       ?? orderData.changeAmount ?? 0);
  const cashier       = orderData.cashier || orderData.cashierName
                        || settings.cashier_name || settings.cashierName || 'الحاج أبوعلي';

  /* ── Computed counts ── */
  const linesCount = orderData.linesCount ?? items.length;
  const itemsCount = orderData.itemsCount ?? items.reduce((s, i) => s + Number(i.quantity || 1), 0);

  /* ── Print handler ── */
  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=420,height=750');
    win.document.write(`
      <html dir="rtl">
        <head>
          <meta charset="UTF-8"/>
          <title>فاتورة ${orderNumber}</title>
          <style>${PRINT_STYLES}</style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  /* ── Shared style atoms ── */
  const row = (extra = {}) => ({
    display: 'flex', justifyContent: 'space-between',
    fontSize: '13px', color: '#6b7280', ...extra,
  });
  const dashed = { borderTop: '1.5px dashed #d1d5db', margin: '16px 0' };

  /* ════════════════════════════════════════════
     Render
  ════════════════════════════════════════════ */
  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }}
      />

      {/* ── Modal Shell ── */}
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '16px',
          width: '100%', maxWidth: '430px', maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          direction: 'rtl',
        }}>

          {/* ── Top Action Bar ── */}
          <div style={{
            background: '#111827', padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>
              🧾 الفاتورة
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrint}
                style={{
                  background: '#16a34a', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  padding: '8px 16px', fontWeight: 700, fontSize: '13px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'inherit',
                }}
              >
                <Printer size={15} /> طباعة
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.12)', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  padding: '8px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Scrollable Receipt Body ── */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div ref={printRef} style={{ background: '#fff', padding: '24px 20px', color: '#111' }}>

              {/* ── Store Header ── */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: '#f0fdf4', border: '2px solid #bbf7d0',
                  borderRadius: '14px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', margin: '0 auto 12px',
                }}>🌿</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
                  {storeName}
                </div>
                {storePhone && (
                  <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Phone size={11} /> {storePhone}
                  </div>
                )}
                {storeAddress && (
                  <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <MapPin size={11} /> {storeAddress}
                  </div>
                )}
              </div>

              <div style={dashed} />

              {/* ── Meta Grid ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>رقم الفاتورة</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>
                    {String(orderNumber)}
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>التاريخ والوقت</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {formatDate(createdAt)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>البائع</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{cashier}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>الحالة</div>
                  <span style={{
                    background: '#dcfce7', color: '#16a34a',
                    padding: '2px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}>
                    <CheckCircle size={11} /> مدفوعة
                  </span>
                </div>
              </div>

              <div style={dashed} />

              {/* ── Items Table Header ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 44px 54px 62px',
                gap: '4px', fontSize: '11px', color: '#9ca3af',
                fontWeight: 600, marginBottom: '6px',
              }}>
                <div style={{ textAlign: 'right' }}>الصنف</div>
                <div style={{ textAlign: 'center' }}>الكمية</div>
                <div style={{ textAlign: 'center' }}>السعر</div>
                <div style={{ textAlign: 'left' }}>الإجمالي</div>
              </div>

              {/* ── Items Rows ── */}
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '12px 0', fontSize: '13px' }}>
                  لا توجد أصناف
                </div>
              ) : (
                items.map((item, i) => {
                  const lineTotal = getItemSubtotal(item);
                  const price     = Number(item.unitPrice || item.price || 0);
                  return (
                    <div
                      key={item.id ?? i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 44px 54px 62px',
                        gap: '4px', fontSize: '13px',
                        padding: '7px 0',
                        borderBottom: '1px solid #f3f4f6',
                        alignItems: 'center', color: '#1f2937',
                      }}
                    >
                      <div style={{ fontWeight: 600, textAlign: 'right', lineHeight: '1.3' }}>
                        {getItemName(item, i)}
                      </div>
                      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                        {getItemQty(item)}
                      </div>
                      <div style={{ textAlign: 'center', color: '#6b7280' }}>
                        {price.toFixed(2)}
                      </div>
                      <div style={{ textAlign: 'left', fontWeight: 700, color: '#16a34a' }}>
                        {lineTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}

              <div style={dashed} />

              {/* ── Item Counts ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
                <div style={row()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={12} /> {linesCount} صنف
                  </span>
                  <span>عدد الأصناف</span>
                </div>
                <div style={row()}>
                  <span>{Number(itemsCount).toFixed(itemsCount % 1 !== 0 ? 2 : 0)} قطعة / وحدة</span>
                  <span>إجمالي القطع</span>
                </div>
              </div>

              <div style={dashed} />

              {/* ── Totals ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {/* Subtotal */}
                <div style={row()}>
                  <span>{fmt(subtotal)}</span>
                  <span>المجموع الفرعي</span>
                </div>

                {/* Discount — only if > 0 */}
                {discount > 0 && (
                  <div style={row({ color: '#dc2626' })}>
                    <span>- {fmt(discount)}</span>
                    <span>🏷️ الخصم</span>
                  </div>
                )}

                {/* Tax — only if > 0 */}
                {tax > 0 && (
                  <div style={row()}>
                    <span>{fmt(tax)}</span>
                    <span>الضريبة</span>
                  </div>
                )}

                {/* Grand Total */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '17px', fontWeight: 800, color: '#111',
                  padding: '10px 14px',
                  background: '#f0fdf4',
                  borderRadius: '10px',
                  border: '1px solid #bbf7d0',
                }}>
                  <span style={{ color: '#16a34a' }}>{fmt(total)}</span>
                  <span>💰 الإجمالي</span>
                </div>

                {/* Payment method */}
                <div style={row()}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>
                    {getPaymentLabel(paymentMethod)}
                  </span>
                  <span>طريقة الدفع</span>
                </div>

                {/* Amount paid */}
                <div style={row()}>
                  <span>{fmt(paidAmount)}</span>
                  <span>المبلغ المدفوع</span>
                </div>

                {/* Change — only if > 0 */}
                {change > 0 && (
                  <div style={row({ color: '#2563eb' })}>
                    <span style={{ fontWeight: 600 }}>{fmt(change)}</span>
                    <span>الباقي</span>
                  </div>
                )}
              </div>

              <div style={dashed} />

              {/* ── Footer ── */}
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', lineHeight: '1.8' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>🙏</div>
                <div style={{ fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>
                  {receiptFooter}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;