import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

const icons = {
  success: <CheckCircle  size={18} />,
  error:   <XCircle     size={18} />,
  warning: <AlertCircle size={18} />,
  info:    <Info        size={18} />,
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className={`${styles.toast} ${styles[toast.type || 'info']}`}>
      <span className={styles.icon}>{icons[toast.type || 'info']}</span>
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.close} onClick={onRemove}><X size={14} /></button>
    </div>
  );
};

export default Toast;