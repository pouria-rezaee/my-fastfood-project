// ابزارهای تقویم شمسی (بدون کتابخانه‌ی اضافه؛ بر پایه‌ی Intl مرورگر)
export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// ایندکس ۰ = شنبه ... ۶ = جمعه
export const WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

const fmt = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const fa = (n) =>
  Number(n).toLocaleString("fa-IR", { useGrouping: false });

export function jalaliParts(date) {
  const parts = fmt.formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

// شنبه = ۰ ... جمعه = ۶
export function weekdayIndex(date) {
  return (date.getDay() + 1) % 7;
}

const ordinal = ({ y, m, d }) => y * 400 + m * 32 + d;

// تاریخ میلادی (ساعت ۱۲ ظهر) معادل یک تاریخ شمسی
export function jalaliToDate(y, m, d) {
  const approxDays = m <= 6 ? (m - 1) * 31 : 186 + (m - 7) * 30;
  const date = new Date(y + 621, 2, 21 + approxDays + d - 1, 12);
  for (let i = 0; i < 40; i++) {
    const p = jalaliParts(date);
    const diff = ordinal(p) - ordinal({ y, m, d });
    if (diff === 0) return date;
    // اختلاف را به روز تقریبی تبدیل می‌کنیم و یک قدم برمی‌گردیم
    date.setDate(date.getDate() + (diff > 0 ? -1 : 1));
  }
  return date;
}

// طول ماه و روز هفته‌ی اولِ ماه
export function monthInfo(y, m) {
  const first = jalaliToDate(y, m, 1);
  const next = m === 12 ? jalaliToDate(y + 1, 1, 1) : jalaliToDate(y, m + 1, 1);
  const len = Math.round((next - first) / 86400000);
  return { len, firstWd: weekdayIndex(first) };
}
