import { useMemo, useState } from "react";
import CustomerCard from "../customers/CustomerCard";
import CustomerModal from "../customers/CustomerModal";
import Select from "../../../components/select/Select";
import { getAllUsers } from "../../../utils/auth";
import { useOrders } from "../../../data/orderStore";
import { useCrm, tagLabel } from "../../../data/crmStore";
import { formatPrice, toEnglishDigits } from "../../../data/format";
import { fa } from "../../../utils/jalali";
import { downloadCsv } from "../../../utils/csv";
import "./CustomersSection.css";

const SEGMENTS = [
  { key: "all", label: "همه", test: () => true },
  { key: "vip", label: "VIP", test: (c) => c.tag === "vip" },
  { key: "regular", label: "مشتری ثابت", test: (c) => c.tag === "regular" },
  {
    key: "followup",
    label: "نیاز به پیگیری",
    test: (c) => c.tag === "followup",
  },
  { key: "none", label: "بدون سفارش", test: (c) => c.orderCount === 0 },
];

const SORT_OPTIONS = [
  { value: "spend", label: "بیشترین خرید" },
  { value: "orders", label: "بیشترین سفارش" },
  { value: "recent", label: "آخرین سفارش" },
  { value: "joined", label: "جدیدترین عضو" },
  { value: "name", label: "نام (الفبایی)" },
];

const SORTERS = {
  spend: (a, b) => b.total - a.total,
  orders: (a, b) => b.orderCount - a.orderCount,
  recent: (a, b) => new Date(b.last || 0) - new Date(a.last || 0),
  joined: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  name: (a, b) =>
    (a.fullName || a.username).localeCompare(b.fullName || b.username, "fa"),
};

function CustomersSection() {
  const orders = useOrders();
  const crm = useCrm();
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [sort, setSort] = useState("spend");
  const [selected, setSelected] = useState(null);

  const customers = useMemo(
    () =>
      getAllUsers()
        .filter((u) => u.role !== "admin")
        .map((u) => {
          const mine = orders.filter(
            (o) => o.username === u.username && o.status !== "cancelled",
          );
          return {
            ...u,
            orderCount: mine.length,
            total: mine.reduce((s, o) => s + o.total, 0),
            last: mine.length ? mine[0].createdAt : null,
            tag: crm[u.username]?.tag || "",
            note: crm[u.username]?.note || "",
          };
        }),
    [orders, crm],
  );

  const q = toEnglishDigits(query).trim().toLowerCase();
  const seg = SEGMENTS.find((s) => s.key === segment);
  const list = customers
    .filter(seg.test)
    .filter(
      (c) =>
        !q ||
        c.username.toLowerCase().includes(q) ||
        (c.fullName || "").toLowerCase().includes(q) ||
        toEnglishDigits(c.phone || "").includes(q),
    )
    .sort(SORTERS[sort]);

  const active = customers.filter((c) => c.orderCount > 0);
  const totalRevenue = customers.reduce((s, c) => s + c.total, 0);
  const tiles = [
    { label: "کل مشتریان", value: fa(customers.length) },
    { label: "مشتریان فعال", value: fa(active.length), sub: "حداقل یک سفارش" },
    {
      label: "مجموع خرید مشتریان",
      value: formatPrice(totalRevenue),
      sub: "تومان",
      brand: true,
    },
    {
      label: "میانگین ارزش هر مشتری",
      value: formatPrice(
        active.length ? Math.round(totalRevenue / active.length) : 0,
      ),
      sub: "تومان",
    },
  ];

  const exportCsv = () =>
    downloadCsv("customers.csv", [
      [
        "نام کاربری",
        "نام",
        "موبایل",
        "ایمیل",
        "تعداد سفارش",
        "مجموع خرید",
        "برچسب",
      ],
      ...list.map((c) => [
        c.username,
        c.fullName,
        c.phone,
        c.email,
        c.orderCount,
        c.total,
        tagLabel(c.tag),
      ]),
    ]);

  return (
    <>
      <div className="cu-tiles">
        {tiles.map((t) => (
          <div key={t.label} className={`cu-tile ${t.brand ? "brand" : ""}`}>
            <span>{t.label}</span>
            <strong>{t.value}</strong>
            {t.sub && <small>{t.sub}</small>}
          </div>
        ))}
      </div>

      <div className="cu-toolbar">
        <input
          className="adm-input cu-search"
          placeholder="جستجو: نام، نام کاربری یا موبایل"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="cu-select">
          <Select
            ariaLabel="مرتب‌سازی مشتریان"
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
        {SEGMENTS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`adm-chip ${segment === s.key ? "active" : ""}`}
            onClick={() => setSegment(s.key)}
          >
            {s.label} ({fa(customers.filter(s.test).length)})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="adm-empty">مشتری پیدا نشد</p>
      ) : (
        <div className="cu-grid">
          {list.map((c) => (
            <CustomerCard key={c.username} customer={c} onOpen={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <CustomerModal
          customer={
            customers.find((c) => c.username === selected.username) || selected
          }
          orders={orders.filter((o) => o.username === selected.username)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

export default CustomersSection;
