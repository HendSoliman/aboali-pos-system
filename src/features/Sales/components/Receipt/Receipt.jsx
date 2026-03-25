// src/features/Sales/components/Receipt.jsx
import React, { useRef } from 'react';
import { X, Printer, Store, MapPin, Phone, CheckCircle } from 'lucide-react';

const Receipt = ({ isOpen, orderData, onClose, settings = {} }) => {
  const printRef = useRef();

  if (!isOpen || !orderData) return null;

  const storeName    = settings.storeName    || 'علافة وعطارة الحاج أبو علي';
  const storePhone   = settings.storePhone   || '٠١٢٨٢٧٢٣٢٦';
  const storeAddress = settings.storeAddress || 'مجاورة ٢٢ - مدينة ١٥ مايو';

  const items        = orderData.items        || orderData.orderItems || [];
  const total        = orderData.total        || orderData.totalAmount || 0;
  const paymentMethod= orderData.paymentMethod|| 'نقدي';
  const orderNumber  = orderData.orderNumber  || orderData.id || '—';
  const createdAt    = orderData.createdAt    || orderData.date || new Date().toISOString();
  const paidAmount   = orderData.paidAmount   || total;
  const change       = orderData.change       || 0;
  const cashier      = orderData.cashier      || settings.cashierName || 'الحاج أبوعلي';

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      const date = d.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${time} ${date}`;
    } catch { return iso; }
  };

  const fmt = (n) => `${Number(n).toFixed(2)} ج.م`;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=400,height=700');
    win.document.write(`
      <html dir="rtl">
        <head>
          <meta charset="UTF-8"/>
          <title>فاتورة ${orderNumber}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background:#fff; color:#111; padding:16px; width:320px; margin:0 auto; }
            .sep { border:none; border-top:1px dashed #aaa; margin:10px 0; }
            .row { display:flex; justify-content:space-between; font-size:13px; margin:4px 0; }
            .label { color:#555; }
            .bold { font-weight:700; }
            .green { color:#16a34a; }
            .center { text-align:center; }
            .items-header { display:grid; grid-template-columns:1fr auto auto auto; gap:4px; font-size:11px; color:#888; margin:6px 0 4px; }
            .item-row { display:grid; grid-template-columns:1fr auto auto auto; gap:4px; font-size:12px; padding:3px 0; border-bottom:1px solid #f0f0f0; }
            .total-row { display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#16a34a; margin-top:8px; }
            .badge { display:inline-block; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:700; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

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
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          direction: 'rtl',
        }}>

          {/* ── Top Action Bar (dark) ── */}
          <div style={{
            background: '#111827',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700, fontSize: '15px' }}>
              🧾 الفاتورة
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrint}
                style={{
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                }}
              >
                <Printer size={15} /> طباعة
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Scrollable Receipt Body ── */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div ref={printRef} style={{ background: '#fff', padding: '24px 20px', color: '#111' }}>

              {/* Store Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: '#f0fdf4',
                  border: '2px solid #bbf7d0',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px',
                  margin: '0 auto 12px',
                }}>🌿</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>
                  {storeName}
                </div>
                <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                  <Phone size={11} /> {storePhone}
                </div>
                <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <MapPin size={11} /> {storeAddress}
                </div>
              </div>

              {/* Dashed Separator */}
              <div style={{ borderTop: '1.5px dashed #d1d5db', margin: '16px 0' }} />

              {/* Meta Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>رقم الفاتورة</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>{orderNumber}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>التاريخ والوقت</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{formatDate(createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>البائع</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{cashier}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>الحالة</div>
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

              {/* Dashed Separator */}
              <div style={{ borderTop: '1.5px dashed #d1d5db', margin: '16px 0' }} />

              {/* Items Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 40px 55px 65px',
                gap: '4px',
                fontSize: '11px',
                color: '#9ca3af',
                fontWeight: 600,
                marginBottom: '6px',
                textAlign: 'left',
              }}>
                <div style={{ textAlign: 'right' }}>الصنف</div>
                <div style={{ textAlign: 'center' }}>الكمية</div>
                <div style={{ textAlign: 'center' }}>السعر</div>
                <div style={{ textAlign: 'left' }}>الإجمالي</div>
              </div>

              {/* Items */}
              {items.map((item, i) => {
                const name     = item.productName || item.name || `صنف ${i + 1}`;
                const qty      = item.quantity    || 1;
                const price    = item.unitPrice   || item.price || 0;
                const subtotal = item.subtotal    || (qty * price);
                return (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 40px 55px 65px',
                      gap: '4px',
                      fontSize: '13px',
                      padding: '7px 0',
                      borderBottom: '1px solid #f3f4f6',
                      alignItems: 'center',
                      color: '#1f2937',
                    }}
                  >
                    <div style={{ fontWeight: 600, textAlign: 'right' }}>{name}</div>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>{qty}</div>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>{Number(price).toFixed(2)}</div>
                    <div style={{ textAlign: 'left', fontWeight: 700, color: '#16a34a' }}>{Number(subtotal).toFixed(2)}</div>
                  </div>
                );
              })}

              {/* Dashed Separator */}
              <div style={{ borderTop: '1.5px dashed #d1d5db', margin: '16px 0' }} />

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                  <span>{fmt(total)}</span>
                  <span>المجموع الفرعي</span>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '17px', fontWeight: 800,
                  color: '#111',
                  padding: '10px 14px',
                  background: '#f9fafb',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                }}>
                  <span style={{ color: '#16a34a' }}>{fmt(total)}</span>
                  <span>💰 الإجمالي</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{paymentMethod}</span>
                  <span>🖥️ طريقة الدفع</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                  <span>{fmt(paidAmount)}</span>
                  <span>المبلغ المدفوع</span>
                </div>
                {change > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>{fmt(change)}</span>
                    <span>الباقي</span>
                  </div>
                )}
              </div>

              {/* Dashed Separator */}
              <div style={{ borderTop: '1.5px dashed #d1d5db', margin: '16px 0' }} />

              {/* Footer */}
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', lineHeight: '1.8' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>🙏</div>
                <div style={{ fontWeight: 600, color: '#6b7280' }}>شكراً لزيارتكم</div>
                <div>نتمنى لكم تجربة تسوق ممتازة</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;