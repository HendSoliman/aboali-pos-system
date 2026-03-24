import { useState, useCallback } from 'react';

let _id = 0;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error   = useCallback((msg) => addToast(msg, 'error'),   [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const info    = useCallback((msg) => addToast(msg, 'info'),    [addToast]);

  return { toasts, removeToast, success, error, warning, info };
};

export default useToast;
