import { useState } from "react";
import StatusBadge from "../../../components/statusbadge/StatusBadge";
import Select from "../../../components/select/Select";
import { Modal, notify } from "../ui";
import { avatarStyle } from "./CustomerCard";
import { TAGS, saveCustomerCrm } from "../../../data/crmStore";
import { formatPrice, formatDate, formatDateTime } from "../../../data/format";
import { fa } from "../../../utils/jalali";
import "./CustomerModal.css";

const TAG_OPTIONS = TAGS.map((t) => ({ value: t.key, label: t.label }));

function CustomerModal({ customer: c, orders, onClose }) {
  const [tag, setTag] = useState(c.tag);
  const [note, setNote] = useState(c.note);
  const name = c.fullName || c.username;

  const save = () => {
    if (notify(saveCustomerCrm(c.username, { tag, note }))) onClose();
  };

  const avg = c.orderCount ? Math.round(c.total / c.orderCount) : 0;

  return (
    <Modal title="پرونده‌ی مشتری" onClose={onClose}>
      <div className="cm-head">
        <span className="cm-avatar" style={avatarStyle(c.username)}>
          {name.charAt(0)}
        </span>
        <div>
          <h3>{name}</h3>
          <span className="cm-sub">
            <bdi dir="ltr">@{c.username}</bdi>
            {c.createdAt && ` · عضو از ${formatDate(c.createdAt)}`}
          </span>
        </div>
      </div>

      <div className="cm-tiles">
        <div>
          <small>سفارش</small>
          <b>{fa(c.orderCount)}</b>
        </div>
        <div>
          <small>مجموع خرید</small>
          <b>{formatPrice(c.total)}</b>
        </div>
        <div>
          <small>میانگین سفارش</small>
          <b>{formatPrice(avg)}</b>
        </div>
      </div>

      <div className="cm-info">
        <p>
          <span>موبایل</span>
          <b dir="ltr">{c.phone || "—"}</b>
        </p>
        <p>
          <span>ایمیل</span>
          <b dir="ltr">{c.email || "—"}</b>
        </p>
        <p>
          <span>آدرس</span>
          <b>{c.address || "—"}</b>
        </p>
      </div>

      <div className="adm-field">
        <label>برچسب</label>
        <Select
          ariaLabel="برچسب مشتری"
          value={tag}
          options={TAG_OPTIONS}
          onChange={setTag}
        />
      </div>
      <div className="adm-field">
        <label>یادداشت داخلی</label>
        <textarea
          className="adm-input"
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="مثلاً: ترجیح می‌دهد بدون پیاز سفارش بدهد"
        />
      </div>

      <h4 className="cm-h">آخرین سفارش‌ها</h4>
      {orders.length === 0 ? (
        <p className="adm-empty">هنوز سفارشی ثبت نکرده</p>
      ) : (
        <ul className="cm-orders">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id}>
              <b>{o.code}</b>
              <span>{formatPrice(o.total)}</span>
              <StatusBadge status={o.status} />
              <small>{formatDateTime(o.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}

      <div className="adm-modal-foot">
        <button type="button" className="adm-btn" onClick={onClose}>
          بستن
        </button>
        <button type="button" className="adm-btn primary" onClick={save}>
          ذخیره
        </button>
      </div>
    </Modal>
  );
}

export default CustomerModal;
