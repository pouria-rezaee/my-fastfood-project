import { useState } from "react";
import StatusBadge from "../../../components/statusbadge/StatusBadge";
import { useOrders, updateOrderStatus, STATUSES, PAYMENT_LABELS, statusLabel } from "../../../data/orderStore";
import { formatPrice, formatDateTime, toEnglishDigits } from "../../../data/format";
import { downloadCsv } from "../../../utils/csv";
import { notify } from "../ui";
import "./OrdersSection.css";

function OrdersSection() {
  const orders = useOrders();
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const q = toEnglishDigits(query).trim().toLowerCase();
  const list = orders.filter((o) => {
    if (filter && o.status !== filter) return false;
    if (!q) return true;
    return (
      o.code.toLowerCase().includes(q) ||
      (o.fullName || "").toLowerCase().includes(q) ||
      toEnglishDigits(o.phone).includes(q)
    );
  });

  const countOf = (key) => orders.filter((o) => o.status === key).length;

  const exportCsv = () => {
    downloadCsv("orders.csv", [
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
  };

  return (
    <>
      <div className="adm-toolbar">
        <input
          className="adm-input"
          placeholder="جستجو: کد سفارش، نام یا موبایل"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="adm-btn" onClick={exportCsv}>
          خروجی CSV
        </button>
      </div>

      <div className="adm-chips">
        <button className={`adm-chip ${filter === "" ? "active" : ""}`} onClick={() => setFilter("")}>
          همه ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            className={`adm-chip ${filter === s.key ? "active" : ""}`}
            onClick={() => setFilter(s.key)}
          >
            {s.label} ({countOf(s.key)})
          </button>
        ))}
      </div>

      {list.length === 0 && <p className="adm-empty">سفارشی پیدا نشد</p>}

      <div className="adm-list">
        {list.map((o) => {
          const open = openId === o.id;
          return (
            <div key={o.id} className="adm-card adm-order">
              <div className="adm-order-head" onClick={() => setOpenId(open ? null : o.id)}>
                <div>
                  <strong>{o.code}</strong>
                  <small>
                    {o.fullName} · {formatDateTime(o.createdAt)}
                  </small>
                </div>
                <div className="adm-order-side">
                  <b>{formatPrice(o.total)} تومان</b>
                  <StatusBadge status={o.status} />
                </div>
              </div>

              {open && (
                <div className="adm-order-body">
                  <div className="adm-grid-2">
                    <div>
                      <h4>اطلاعات مشتری</h4>
                      <p>نام: {o.fullName}</p>
                      <p>موبایل: {o.phone}</p>
                      <p>آدرس: {o.address}</p>
                      {o.note && <p>توضیحات: {o.note}</p>}
                    </div>
                    <div>
                      <h4>پرداخت</h4>
                      <p>{PAYMENT_LABELS[o.paymentStatus]}</p>
                      {o.paymentRef && <p>کد تراکنش: {o.paymentRef}</p>}
                      <p>هزینه ارسال: {o.deliveryFee === 0 ? "رایگان" : formatPrice(o.deliveryFee)}</p>
                    </div>
                  </div>

                  <h4>اقلام</h4>
                  <ul className="adm-items">
                    {o.items.map((i) => (
                      <li key={i.id}>
                        <span>
                          {i.name} × {i.qty}
                        </span>
                        <span>{formatPrice(i.price * i.qty)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="adm-status-row">
                    <label>تغییر وضعیت:</label>
                    <select
                      className="adm-input"
                      value={o.status}
                      onChange={(e) => notify(updateOrderStatus(o.id, e.target.value), "وضعیت به‌روز شد")}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h4>تاریخچه</h4>
                  <ul className="adm-history">
                    {(o.history || []).map((h, idx) => (
                      <li key={idx}>
                        {statusLabel(h.status)} <small>{formatDateTime(h.at)}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default OrdersSection;