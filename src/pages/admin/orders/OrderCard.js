import StatusBadge from "../../../components/statusbadge/StatusBadge";
import Select from "../../../components/select/Select";
import {
  updateOrderStatus,
  STATUSES,
  PAYMENT_LABELS,
  statusLabel,
} from "../../../data/orderStore";
import { formatPrice, formatDateTime } from "../../../data/format";
import { fa } from "../../../utils/jalali";
import { notify } from "../ui";
import "./OrderCard.css";

const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s.key, label: s.label }));

// گام بعدیِ هر وضعیت (دکمه‌ی سریع)
const NEXT = {
  pending: { to: "preparing", label: "تأیید و شروع آماده‌سازی" },
  preparing: { to: "delivering", label: "ارسال شد" },
  delivering: { to: "delivered", label: "تحویل داده شد" },
};

function OrderCard({ order: o, open, onToggle }) {
  const next = NEXT[o.status];
  const setStatus = (status) =>
    notify(updateOrderStatus(o.id, status), "وضعیت به‌روز شد");

  return (
    <article className={`oc ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="oc-head"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="oc-id">
          <b>{o.code}</b>
          <small>
            {o.fullName} · {formatDateTime(o.createdAt)}
          </small>
        </span>
        <span className="oc-side">
          <span className="oc-total">{formatPrice(o.total)} تومان</span>
          <StatusBadge status={o.status} />
          <svg className="oc-arrow" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 7.5l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className="oc-body">
          <div className="oc-cols">
            <div>
              <h4>مشتری</h4>
              <p>{o.fullName}</p>
              <p dir="ltr" className="oc-ltr">
                {o.phone}
              </p>
              <p>{o.address}</p>
              {o.note && <p className="oc-note">«{o.note}»</p>}
            </div>
            <div>
              <h4>پرداخت</h4>
              <p>{PAYMENT_LABELS[o.paymentStatus]}</p>
              {o.paymentRef && (
                <p className="oc-ltr" dir="ltr">
                  {o.paymentRef}
                </p>
              )}
              <p>
                هزینه‌ی ارسال:{" "}
                {o.deliveryFee === 0
                  ? "رایگان"
                  : `${formatPrice(o.deliveryFee)} تومان`}
              </p>
              {o.discount > 0 && <p>تخفیف: {formatPrice(o.discount)} تومان</p>}
            </div>
          </div>

          <h4>اقلام</h4>
          <ul className="oc-items">
            {o.items.map((i) => (
              <li key={i.id}>
                <span>
                  {i.name} <em>× {fa(i.qty)}</em>
                </span>
                <b>{formatPrice(i.price * i.qty)}</b>
              </li>
            ))}
          </ul>

          <div className="oc-actions">
            {next && (
              <button
                type="button"
                className="adm-btn primary"
                onClick={() => setStatus(next.to)}
              >
                {next.label}
              </button>
            )}
            <div className="oc-status-select">
              <Select
                size="sm"
                ariaLabel="تغییر وضعیت سفارش"
                value={o.status}
                options={STATUS_OPTIONS}
                onChange={setStatus}
              />
            </div>
          </div>

          <h4>تاریخچه</h4>
          <ol className="oc-history">
            {(o.history || []).map((h, idx) => (
              <li key={idx}>
                <span className="oc-dot" />
                {statusLabel(h.status)}
                <small>{formatDateTime(h.at)}</small>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default OrderCard;
