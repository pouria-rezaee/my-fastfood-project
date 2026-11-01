import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe } from "./storage";

export const defaultSettings = {
  name: "کافه برگرخونه",
  tagline: "بهترین برگرهای شهر با مواد اولیه درجه یک",
  address: "تهران، خیابان اصلی، پلاک ۱۲۳",
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  mobile: "۰۹۱۲-۱۲۳۴۵۶۷",
  email: "info@burgerkhoone.ir",
  supportEmail: "support@burgerkhoone.ir",
  hours: "همه‌روزه ۱۲:۰۰ تا ۲۴:۰۰",
  deliveryFee: 25000,
  freeDeliveryOver: 500000,
};

const KEY = "settings";

export function getSettings() {
  return readStore(KEY, () => ({ ...defaultSettings }));
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings);
}

export function saveSettings(patch) {
  return writeStore(KEY, { ...getSettings(), ...patch });
}
