export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key] ?? 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

export const sumBy = (arr, key) =>
  arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
