import { fa } from "../../../utils/jalali";
import { formatPrice } from "../../../data/format";
import "./ScopeStats.css";

// آمار بازه‌ی انتخاب‌شده (سال، ماه، هفته یا روز)
function ScopeStats({ stats }) {
  const tiles = [
    { label: "تعداد سفارش", value: fa(stats.count), tone: "" },
    {
      label: "مجموع فروش",
      value: `${formatPrice(stats.revenue)}`,
      unit: "تومان",
      tone: "brand",
    },
    {
      label: "میانگین هر سفارش",
      value: formatPrice(stats.avg),
      unit: "تومان",
      tone: "",
    },
    {
      label: "در انتظار تأیید",
      value: fa(stats.pending),
      tone: stats.pending ? "warn" : "",
    },
    {
      label: "لغو شده",
      value: fa(stats.cancelled),
      tone: stats.cancelled ? "danger" : "",
    },
  ];

  return (
    <div className="ss">
      {tiles.map((t) => (
        <div key={t.label} className={`ss-tile ${t.tone}`}>
          <span>{t.label}</span>
          <strong>
            {t.value}
            {t.unit && <small>{t.unit}</small>}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default ScopeStats;
