import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import { Button } from '../../../components';
import useSalesState from '../hooks/useSalesState';
import { formatCurrency } from '../../../utils/formatters';
import useToast from '../../../hooks/useToast';
import { Toast } from '../../../components';

const CheckoutModal = ({ isOpen, onClose }) => {
  const {
    subtotal, discountAmount, taxAmount, total,
    paymentMethod, cartItems, handleClearCart,
  } = useSalesState();
  const { toasts, removeToast, success } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // Simulate API
    success('تم إتمام عملية البيع بنجاح! ✅');
    handleClearCart();
    setLoading(false);
    onClose();
  };

  const PAYMENT_LABELS = { cash: 'نقداً', card: 'بطاقة', transfer: 'تحويل' };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Modal isOpen={isOpen} onClose={onClose} title="تأكيد عملية الدفع" size="md">
        <div className="flex flex-col gap-4">
          {/* Items Summary */}
          <div className="bg-dark-900 rounded-xl p-4 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-1.5 border-b border-dark-700 last:border-0">
                <span className="font-cairo text-sm text-dark-300">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-cairo text-sm font-bold text-dark-100">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-dark-900 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-cairo text-sm text-dark-400">المجموع الفرعي</span>
              <span className="font-cairo text-sm text-dark-200">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="font-cairo text-sm text-dark-400">الخصم</span>
                <span className="font-cairo text-sm text-yellow-400">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-cairo text-sm text-dark-400">الضريبة 15%</span>
              <span className="font-cairo text-sm text-dark-200">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="border-t border-dark-700 my-1" />
            <div className="flex justify-between">
              <span className="font-cairo font-bold text-dark-100">الإجمالي</span>
              <span className="font-cairo font-bold text-xl text-primary-400">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-cairo text-sm text-dark-400">طريقة الدفع</span>
              <span className="font-cairo text-sm text-dark-200">{PAYMENT_LABELS[paymentMethod]}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={onClose}>إلغاء</Button>
            <Button variant="primary" fullWidth loading={loading} onClick={handleConfirm}
              icon={<CheckCircle size={16} />}>
              تأكيد الدفع
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutModal;