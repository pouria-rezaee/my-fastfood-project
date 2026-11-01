import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe } from "./storage";

const KEY = "crm";

export const TAGS = [
  { key: "", label: "بدون برچسب" },
  { key: "vip", label: "VIP" },
  { key: "regular", label: "مشتری ثابت" },
  { key: "followup", label: "نیاز به پیگیری" },
];

export function tagLabel(key) {
  const found = TAGS.find((t) => t.key === key);
  return found ? found.label : "";
}

export function getCrm() {
  return readStore(KEY, () => ({}));
}

export function useCrm() {
  return useSyncExternalStore(subscribe, getCrm);
}

export function saveCustomerCrm(username, patch) {
  const all = getCrm();
  return writeStore(KEY, {
    ...all,
    [username]: { ...(all[username] || {}), ...patch },
  });
}
