export function formatPrice(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("en-US");
}

export function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}
export function formatDateTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// تبدیل اعداد فارسی/عربی به انگلیسی (برای اعتبارسنجی شماره موبایل)
export function toEnglishDigits(value) {
  return String(value || "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}
