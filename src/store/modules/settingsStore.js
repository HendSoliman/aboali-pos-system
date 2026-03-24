import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  settings: {
    storeName:    'متجر نقاط البيع',
    storePhone:   '',
    storeAddress: '',
    taxRate:      15,
    currency:     'EGP',
    printReceipt: true,
    lowStockAlert: 5,
  },
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),
}));

export default useSettingsStore;
