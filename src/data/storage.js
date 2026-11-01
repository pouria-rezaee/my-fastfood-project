// لایه‌ی ذخیره‌سازی دمو: همه‌ی داده‌ها در localStorage نگه داشته می‌شوند
const PREFIX = "bs_";
// اگر داده‌های پیش‌فرض (seed) را عوض کردی، این عدد را زیاد کن تا داده‌های قدیمی پاک شوند
const SEED_VERSION = "3";
const MANAGED_KEYS = ["menu", "blog", "settings"];

const cache = {};
const listeners = new Set();
let versionChecked = false;

function ensureVersion() {
  if (versionChecked) return;
  versionChecked = true;
  try {
    if (localStorage.getItem(PREFIX + "seed_version") !== SEED_VERSION) {
      MANAGED_KEYS.forEach((k) => localStorage.removeItem(PREFIX + k));
      localStorage.setItem(PREFIX + "seed_version", SEED_VERSION);
    }
  } catch {
    /* localStorage در دسترس نیست */
  }
}

export function readStore(key, seed) {
  ensureVersion();
  if (key in cache) return cache[key];
  let value;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    value = raw ? JSON.parse(raw) : undefined;
  } catch {
    value = undefined;
  }
  if (value === undefined) {
    value = typeof seed === "function" ? seed() : seed;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
  cache[key] = value;
  return value;
}

export function writeStore(key, value) {
  const previous = cache[key];
  cache[key] = value;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    cache[key] = previous;
    return {
      success: false,
      message: "حافظه‌ی مرورگر پر است. عکس‌های کوچک‌تر انتخاب کن.",
    };
  }
  listeners.forEach((l) => l());
  return { success: true };
}

export function resetStores() {
  MANAGED_KEYS.forEach((k) => {
    delete cache[k];
    try {
      localStorage.removeItem(PREFIX + k);
    } catch {
      /* ignore */
    }
  });
  listeners.forEach((l) => l());
}

export function subscribe(callback) {
  listeners.add(callback);
  const onStorage = (e) => {
    if (e.key && e.key.startsWith(PREFIX)) {
      delete cache[e.key.slice(PREFIX.length)];
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
