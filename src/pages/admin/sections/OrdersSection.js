import { useMemo, useState } from "react";
import PeriodNav from "../orders/PeriodNav";
import ScopeStats from "../orders/ScopeStats";
import OrderCard from "../orders/OrderCard";
import Select from "../../../components/select/Select";
import {
  useOrders,
  STATUSES,
  PAYMENT_LABELS,
  statusLabel,
} from "../../../data/orderStore";
import {
  formatPrice,
  formatDateTime,
  toEnglishDigits,
} from "../../../data/format";
import { enrich, inScope, summarize, scopeSlug } from "../../../utils/periods";
import { fa } from "../../../utils/jalali";
import { downloadCsv } from "../../../utils/csv";
import "./OrdersSection.css";

const PAGE = 15;

const PAYMENT_OPTIONS = [
  { value: "", label: "همه‌ی پرداخت‌ها" },
  { value: "paid", label: "پرداخت‌شده" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "cod", label: "پرداخت در محل" },
  { value: "refunded", label: "بازگشت وجه" },
];

const SORT_OPTIONS = [
  { value: "new", label: "جدیدترین" },
  { value: "old", label: "قدیمی‌ترین" },
  { value: "high", label: "بیشترین مبلغ" },
  { value: "low", label: "کمترین مبلغ" },
];

const SORTERS = {
  new: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  old: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  high: (a, b) => b.total - a.total,
  low: (a, b) => a.total - b.total,
};

function OrdersSection() {
  const orders = useOrders();
  const [scope, setScope] = useState({});
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [sort, setSort] = useState("new");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [visible, setVisible] = useState(PAGE);

  const all = useMemo(() => enrich(orders), [orders]);
  const scoped = useMemo(
    () => all.filter((o) => inScope(o, scope)),
    [all, scope],
  );
  const stats = useMemo(() => summarize(scoped), [scoped]);

  const q = toEnglishDigits(query).trim().toLowerCase();
  const list = useMemo(
    () =>
      scoped
        .filter((o) => !status || o.status === status)
        .filter((o) => !payment || o.paymentStatus === payment)
        .filter(
          (o) =>
            !q ||
            o.code.toLowerCase().includes(q) ||
            (o.fullName || "").toLowerCase().includes(q) ||
            toEnglishDigits(o.phone).includes(q),
        )
        .sort(SORTERS[sort]),
    [scoped, status, payment, q, sort],
  );

  const changeScope = (next) => {
    setScope(next);
    setOpenId(null);
    setVisible(PAGE);
  };

  const countOf = (key) => scoped.filter((o) => o.status === key).length;

  const exportCsv = () =>
    downloadCsv(`orders-${scopeSlug(scope)}.csv`, [
      ["کد", "تاریخ", "مشتری", "موبایل", "مبلغ", "وضعیت", "پرداخت"],
      ...list.map((o) => [
        o.code,
        formatDateTime(o.createdAt),
        o.fullName,
        o.phone,
        o.total,
        statusLabel(o.status),
        PAYMENT_LABELS[o.paymentStatus],
      ]),
    ]);

  return (
    <>
      <PeriodNav items={all} scope={scope} onChange={changeScope} />
      <ScopeStats stats={stats} />

      <div className="os-toolbar">
        <input
          className="adm-input os-search"
          placeholder="جستجو: کد سفارش، نام یا موبایل"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE);
          }}
        />
        <div className="os-select">
          <Select
            ariaLabel="فیلتر پرداخت"
            value={payment}
            options={PAYMENT_OPTIONS}
            onChange={setPayment}
          />
        </div>
        <div className="os-select">
          <Select
            ariaLabel="مرتب‌سازی"
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </div>
        <button type="button" className="adm-btn" onClick={exportCsv}>
          خروجی CSV
        </button>
      </div>

      <div className="adm-chips">
        <button
          type="button"
          className={`adm-chip ${status === "" ? "active" : ""}`}
          onClick={() => setStatus("")}
        >
          همه ({fa(scoped.length)})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`adm-chip ${status === s.key ? "active" : ""}`}
            onClick={() => setStatus(s.key)}
          >
            {s.label} ({fa(countOf(s.key))})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="adm-empty">در این بازه سفارشی پیدا نشد</p>
      ) : (
        <>
          <p className="os-result">
            {fa(list.length)} سفارش · {formatPrice(summarize(list).revenue)}{" "}
            تومان
          </p>
          <div className="os-list">
            {list.slice(0, visible).map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                open={openId === o.id}
                onToggle={() => setOpenId(openId === o.id ? null : o.id)}
              />
            ))}
          </div>
          {list.length > visible && (
            <button
              type="button"
              className="adm-btn os-more"
              onClick={() => setVisible(visible + PAGE)}
            >
              نمایش بیشتر ({fa(list.length - visible)} سفارش دیگر)
            </button>
          )}
        </>
      )}
    </>
  );
}

export default OrdersSection;
