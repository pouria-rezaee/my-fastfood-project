import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe, makeId } from "./storage";
import seedMenu from "./seedMenu";

export const CATEGORIES = [
  { key: "burger", label: "برگر" },
  { key: "pizza", label: "پیتزا" },
  { key: "fried", label: "سوخاری" },
  { key: "pasta", label: "پاستا" },
  { key: "chicken", label: "غذای مرغ" },
  { key: "potato", label: "سیب‌زمینی" },
  { key: "salad", label: "سالاد" },
  { key: "drink", label: "نوشیدنی" },
];

export function categoryLabel(key) {
  const found = CATEGORIES.find((c) => c.key === key);
  return found ? found.label : key;
}

const KEY = "menu";
const seed = () => seedMenu.map((i) => ({ ...i }));

export function getMenu() {
  return readStore(KEY, seed);
}

export function useMenu() {
  return useSyncExternalStore(subscribe, getMenu);
}

export function addMenuItem(data) {
  const newItem = {
    id: makeId("m"),
    imageKey: "",
    image: "",
    description: "",
    category: "burger",
    rating: 4,
    salesCount: 0,
    available: true,
    ...data,
    price: Number(data.price) || 0,
    createdAt: new Date().toISOString(),
  };
  return writeStore(KEY, [newItem, ...getMenu()]);
}

export function updateMenuItem(id, patch) {
  const next = getMenu().map((i) =>
    i.id === id
      ? {
          ...i,
          ...patch,
          price: patch.price !== undefined ? Number(patch.price) || 0 : i.price,
        }
      : i,
  );
  return writeStore(KEY, next);
}

export function deleteMenuItem(id) {
  return writeStore(
    KEY,
    getMenu().filter((i) => i.id !== id),
  );
}
