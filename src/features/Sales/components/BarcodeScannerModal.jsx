import React, { useRef, useEffect } from 'react';
import { Scan } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';

const BarcodeScannerModal = ({ isOpen, onClose, onBarcodeScanned }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleInput = (e) => {
    const val = e.target.value.trim();
    if (val.length >= 4) {
      onBarcodeScanned(val);
      e.target.value = '';
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مسح الباركود" size="sm">
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="w-20 h-20 bg-dark-900 rounded-2xl flex items-center justify-center">
          <Scan size={40} className="text-primary-400 animate-pulse" />
        </div>
        <p className="font-cairo text-sm text-dark-400 text-center">
          وجّه الماسح نحو الباركود أو أدخله يدوياً
        </p>
        <input
          ref={inputRef}
          type="text"
          className="input-base text-center text-lg tracking-widest"
          placeholder="000000000000"
          onChange={handleInput}
        />
      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;