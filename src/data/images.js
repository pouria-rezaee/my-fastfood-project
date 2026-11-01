// رجیستری عکس‌ها: کلید = نام فایل بدون پسوند (مثلاً "1" یا "pizzasample2")
// داده‌های ذخیره‌شده فقط کلید را نگه می‌دارند، نه آدرس هش‌دار فایل
const ctx = require.context(
  "../assets/images/img",
  false,
  /\.(png|jpe?g|webp|gif|svg)$/i,
);

const byKey = {};
const urlToKey = {};

ctx.keys().forEach((file) => {
  const mod = ctx(file);
  const url = mod.default || mod;
  const key = file.replace("./", "").replace(/\.[^.]+$/, "");
  byKey[key] = url;
  urlToKey[url] = key;
});

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" font-size="60" text-anchor="middle" dominant-baseline="middle">🍽️</text></svg>',
  );

export function imageFor(item) {
  if (!item) return PLACEHOLDER;
  return item.image || byKey[item.imageKey] || PLACEHOLDER;
}

export function imageKeyByUrl(url) {
  return urlToKey[url] || "";
}

export const imageKeys = Object.keys(byKey);
