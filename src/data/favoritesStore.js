import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe } from "./storage";

const KEY = "favorites";
const EMPTY = [];

function getAll() {
  return readStore(KEY, () => ({}));
}

export function getFavorites(username) {
  return getAll()[username] || EMPTY;
}

export function useFavorites(username) {
  return useSyncExternalStore(subscribe, () => getFavorites(username));
}

export function toggleFavorite(username, id) {
  const all = getAll();
  const current = all[username] || [];
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  return writeStore(KEY, { ...all, [username]: next });
}
