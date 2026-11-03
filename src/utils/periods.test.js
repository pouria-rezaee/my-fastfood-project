import { jalaliParts, jalaliToDate, monthInfo, weekdayIndex } from "./jalali";
import {
  enrich,
  childrenOf,
  summarize,
  weekOf,
  weekRange,
  presetScopes,
  breadcrumbOf,
} from "./periods";

test("jalali conversions", () => {
  expect(jalaliParts(new Date(2026, 2, 21, 12))).toEqual({
    y: 1405,
    m: 1,
    d: 1,
  });
  expect(jalaliParts(new Date(2026, 9, 23, 12))).toEqual({
    y: 1405,
    m: 8,
    d: 1,
  });
  expect(jalaliParts(new Date(2027, 2, 20, 12))).toEqual({
    y: 1405,
    m: 12,
    d: 29,
  });
  // رفت‌وبرگشت برای هر روز یک سال
  for (let i = 0; i < 400; i++) {
    const dt = new Date(2026, 0, 1 + i, 12);
    const p = jalaliParts(dt);
    const back = jalaliToDate(p.y, p.m, p.d);
    expect(back.toDateString()).toBe(dt.toDateString());
  }
});

test("month info", () => {
  expect(monthInfo(1405, 1).len).toBe(31);
  expect(monthInfo(1405, 7).len).toBe(30);
  expect(monthInfo(1405, 12).len).toBe(29); // ۱۴۰۵ کبیسه نیست
  expect(monthInfo(1403, 12).len).toBe(30); // ۱۴۰۳ کبیسه است
  // اول آبان ۱۴۰۵ = ۲۳ اکتبر ۲۰۲۶ = جمعه
  expect(monthInfo(1405, 8).firstWd).toBe(6);
  expect(weekdayIndex(new Date(2026, 9, 23))).toBe(6);
});

test("weeks cover every day exactly once", () => {
  for (const [y, m] of [
    [1405, 8],
    [1405, 1],
    [1405, 12],
    [1403, 12],
  ]) {
    const info = monthInfo(y, m);
    const weeks = Math.ceil((info.len + info.firstWd) / 7);
    const seen = [];
    for (let w = 1; w <= weeks; w++) {
      const { start, end } = weekRange(w, info);
      for (let d = start; d <= end; d++) {
        seen.push(d);
        expect(weekOf(d, info.firstWd)).toBe(w);
      }
    }
    expect(seen).toEqual(Array.from({ length: info.len }, (_, i) => i + 1));
  }
});

test("drill down sums match", () => {
  const mk = (id, date, total, status = "delivered") => ({
    id,
    createdAt: date.toISOString(),
    total,
    status,
  });
  const orders = enrich([
    mk("a", new Date(2026, 9, 23, 10), 100),
    mk("b", new Date(2026, 9, 24, 10), 200),
    mk("c", new Date(2026, 9, 30, 10), 300, "cancelled"),
    mk("d", new Date(2026, 10, 5, 10), 50),
    mk("e", new Date(2025, 5, 1, 10), 70),
  ]);
  const years = childrenOf(orders, {}, new Date(2026, 9, 31, 12));
  expect(years.level).toBe("year");
  expect(years.cells.reduce((s, c) => s + c.count, 0)).toBe(5);
  const y1405 = years.cells.find((c) => c.key === 1405);
  expect(y1405.count).toBe(4);
  const months = childrenOf(orders, { y: 1405 });
  expect(months.cells.length).toBe(12);
  expect(months.cells.reduce((s, c) => s + c.count, 0)).toBe(4);
  const aban = months.cells.find((c) => c.key === 8);
  expect(aban.count).toBe(4);
  expect(aban.revenue).toBe(350);
  const weeks = childrenOf(orders, { y: 1405, m: 8 });
  expect(weeks.cells.reduce((s, c) => s + c.count, 0)).toBe(4);
  const firstWeek = weeks.cells.find((c) => c.count > 0);
  const days = childrenOf(orders, firstWeek.patch);
  expect(days.cells.reduce((s, c) => s + c.count, 0)).toBe(firstWeek.count);
  expect(summarize(orders)).toMatchObject({
    count: 5,
    cancelled: 1,
    revenue: 420,
  });
  expect(presetScopes(new Date(2026, 9, 31, 12)).map((p) => p.label)).toEqual([
    "امروز",
    "این هفته",
    "این ماه",
    "امسال",
    "همه",
  ]);
  expect(breadcrumbOf({ y: 1405, m: 8, w: 2, d: 9 }).length).toBe(5);
});
