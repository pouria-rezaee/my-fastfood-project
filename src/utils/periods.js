// گروه‌بندی سفارش‌ها بر اساس سال ← ماه ← هفته ← روز (تقویم شمسی، هفته از شنبه تا جمعه)
import { JALALI_MONTHS, WEEKDAYS, fa, jalaliParts, monthInfo } from "./jalali";

const infoCache = new Map();
export function cachedMonthInfo(y, m) {
  const key = `${y}-${m}`;
  if (!infoCache.has(key)) infoCache.set(key, monthInfo(y, m));
  return infoCache.get(key);
}

// شماره‌ی هفته‌ی یک روز در ماه (هفته‌ی ۱ تا اولین جمعه است)
export function weekOf(d, firstWd) {
  return Math.floor((d - 1 + firstWd) / 7) + 1;
}

export function weekRange(w, info) {
  return {
    start: Math.max(1, (w - 1) * 7 + 1 - info.firstWd),
    end: Math.min(info.len, w * 7 - info.firstWd),
  };
}

// به هر سفارش، موقعیتش در تقویم شمسی اضافه می‌شود
export function enrich(orders) {
  return orders.map((o) => {
    const p = jalaliParts(new Date(o.createdAt));
    const info = cachedMonthInfo(p.y, p.m);
    return { ...o, _p: { ...p, w: weekOf(p.d, info.firstWd) } };
  });
}

export function inScope(order, scope) {
  const p = order._p;
  return (
    (scope.y === undefined || p.y === scope.y) &&
    (scope.m === undefined || p.m === scope.m) &&
    (scope.w === undefined || p.w === scope.w) &&
    (scope.d === undefined || p.d === scope.d)
  );
}

export function summarize(list) {
  const valid = list.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  return {
    count: list.length,
    validCount: valid.length,
    revenue,
    avg: valid.length ? Math.round(revenue / valid.length) : 0,
    cancelled: list.length - valid.length,
    pending: list.filter((o) => o.status === "pending").length,
  };
}

function cell(items, key, label, sub, patch, extra = {}) {
  const s = summarize(items);
  return {
    key,
    label,
    sub,
    patch,
    count: s.count,
    revenue: s.revenue,
    empty: s.count === 0,
    ...extra,
  };
}

// «پوشه‌های» سطح بعدی نسبت به انتخاب فعلی
export function childrenOf(items, scope, now = new Date()) {
  const scoped = items.filter((o) => inScope(o, scope));

  if (scope.y === undefined) {
    const years = new Set(items.map((o) => o._p.y));
    years.add(jalaliParts(now).y);
    const cells = [...years]
      .sort((a, b) => b - a)
      .map((y) =>
        cell(
          scoped.filter((o) => o._p.y === y),
          y,
          fa(y),
          "سال",
          { y },
        ),
      );
    return { level: "year", title: "سال را انتخاب کنید", cells };
  }

  if (scope.m === undefined) {
    const cells = JALALI_MONTHS.map((name, i) =>
      cell(
        scoped.filter((o) => o._p.m === i + 1),
        i + 1,
        name,
        fa(scope.y),
        { y: scope.y, m: i + 1 },
      ),
    );
    return { level: "month", title: "ماه را انتخاب کنید", cells };
  }

  const info = cachedMonthInfo(scope.y, scope.m);
  const monthName = JALALI_MONTHS[scope.m - 1];

  if (scope.w === undefined) {
    const weeks = Math.ceil((info.len + info.firstWd) / 7);
    const cells = Array.from({ length: weeks }, (_, i) => {
      const w = i + 1;
      const { start, end } = weekRange(w, info);
      const sub =
        start === end
          ? `${fa(start)} ${monthName}`
          : `${fa(start)} تا ${fa(end)} ${monthName}`;
      return cell(
        scoped.filter((o) => o._p.w === w),
        w,
        `هفته‌ی ${fa(w)}`,
        sub,
        { ...scope, w },
      );
    });
    return { level: "week", title: "هفته را انتخاب کنید", cells };
  }

  if (scope.d === undefined) {
    const { start, end } = weekRange(scope.w, info);
    const cells = [];
    for (let d = start; d <= end; d++) {
      const wd = (info.firstWd + d - 1) % 7;
      cells.push(
        cell(
          scoped.filter((o) => o._p.d === d),
          d,
          WEEKDAYS[wd],
          `${fa(d)} ${monthName}`,
          { ...scope, d },
        ),
      );
    }
    return { level: "day", title: "روز را انتخاب کنید", cells };
  }

  return { level: "none", title: "", cells: [] };
}

// مسیر «همه › ۱۴۰۵ › آبان › هفته‌ی ۲ › شنبه ۹»
export function breadcrumbOf(scope) {
  const crumbs = [{ label: "همه", patch: {} }];
  if (scope.y === undefined) return crumbs;
  crumbs.push({ label: fa(scope.y), patch: { y: scope.y } });
  if (scope.m === undefined) return crumbs;
  crumbs.push({
    label: JALALI_MONTHS[scope.m - 1],
    patch: { y: scope.y, m: scope.m },
  });
  if (scope.w === undefined) return crumbs;
  crumbs.push({
    label: `هفته‌ی ${fa(scope.w)}`,
    patch: { y: scope.y, m: scope.m, w: scope.w },
  });
  if (scope.d === undefined) return crumbs;
  const info = cachedMonthInfo(scope.y, scope.m);
  const wd = (info.firstWd + scope.d - 1) % 7;
  crumbs.push({ label: `${WEEKDAYS[wd]} ${fa(scope.d)}`, patch: { ...scope } });
  return crumbs;
}

export function presetScopes(now = new Date()) {
  const p = jalaliParts(now);
  const info = cachedMonthInfo(p.y, p.m);
  const w = weekOf(p.d, info.firstWd);
  return [
    { label: "امروز", scope: { y: p.y, m: p.m, w, d: p.d } },
    { label: "این هفته", scope: { y: p.y, m: p.m, w } },
    { label: "این ماه", scope: { y: p.y, m: p.m } },
    { label: "امسال", scope: { y: p.y } },
    { label: "همه", scope: {} },
  ];
}

export function scopeSlug(scope) {
  return (
    ["y", "m", "w", "d"]
      .filter((k) => scope[k] !== undefined)
      .map((k) => `${k}${scope[k]}`)
      .join("-") || "all"
  );
}
