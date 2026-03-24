export const isRequired     = (v) => v !== null && v !== undefined && v !== '';
export const isPositive     = (v) => Number(v) > 0;
export const isNonNegative  = (v) => Number(v) >= 0;
export const isEmail        = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone        = (v) => /^[0-9+\-\s()]{7,15}$/.test(v);
export const isBarcode      = (v) => /^[0-9]{4,20}$/.test(v);
export const minLength      = (n) => (v) => String(v).length >= n;
export const maxLength      = (n) => (v) => String(v).length <= n;

export const validateProduct = (product) => {
  const errs = {};
  if (!isRequired(product.name))     errs.name     = 'اسم المنتج مطلوب';
  if (!isPositive(product.price))    errs.price    = 'السعر يجب أن يكون أكبر من صفر';
  if (!isNonNegative(product.stock)) errs.stock    = 'المخزون لا يمكن أن يكون سالباً';
  return errs;
};
