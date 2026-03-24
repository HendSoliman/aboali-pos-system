import { useSettingsStore } from '../../../store/appStore';

const useSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  return { settings, updateSettings };
};

export default useSettings;
