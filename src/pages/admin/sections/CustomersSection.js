import { useMemo, useState } from "react";
import StatusBadge from "../../../components/statusbadge/StatusBadge";
import { getAllUsers } from "../../../utils/auth";
import { useOrders } from "../../../data/orderStore";
import {
  useCrm,
  saveCustomerCrm,
  TAGS,
  tagLabel,
} from "../../../data/crmStore";
import {
  formatPrice,
  formatDate,
  formatDateTime,
  toEnglishDigits,
} from "../../../data/format";
import { downloadCsv } from "../../../utils/csv";
import { Modal, notify } from "../ui";

function CustomersSection() {
  const orders = useOrders();
  const crm = useCrm();
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ tag: "", note: "" });

  const customers = useMemo(() => {
    return getAllUsers()
      .filter((u) => u.role !== "admin")
      .map((u) => {
        const mine = orders.filter(
          (o) => o.username === u.username && o.status !== "cancelled",
        );
        const total = mine.reduce((s, o) => s + o.total, 0);
        const last = mine.length ? mine[0].createdAt : null;
        return {
          ...u,
          orderCount: mine.length,
          total,
          last,
          tag: crm[u.username]?.tag || "",
          note: crm[u.username]?.note || "",
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [orders, crm]);

  const q = toEnglishDigits(query).trim().toLowerCase();
  const list = customers.filter((c) => {
    if (tagFilter !== "all" && c.tag !== tagFilter) return false;
    if (!q) return true;
    return (
      c.username.toLowerCase().includes(q) ||
      (c.fullName || "").toLowerCase().includes(q) ||
      toEnglishDigits(c.phone || "").includes(q)
    );
  });

  const open = (c) => {
    setSelected(c);
    setDraft({ tag: c.tag, note: c.note });
  };

  const save = () => {
    if (notify(saveCustomerCrm(selected.username, draft))) setSelected(null);
  };

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

  const history = selected
    ? orders.filter((o) => o.username === selected.username)
    : [];

  return (
    <>
      <div className="adm-toolbar">
        <input
          className="adm-input"
          placeholder="جستجو: نام، نام کاربری یا موبایل"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="adm-input adm-narrow"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="all">همه برچسب‌ها</option>
          {TAGS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        <button className="adm-btn" onClick={exportCsv}>
          خروجی CSV
        </button>
      </div>

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>مشتری</th>
              <th>موبایل</th>
              <th>سفارش‌ها</th>
              <th>مجموع خرید</th>
              <th>آخرین سفارش</th>
              <th>برچسب</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.username}>
                <td>
                  {c.fullName || "—"}
                  <small className="adm-sub">@{c.username}</small>
                </td>
                <td>{c.phone || "—"}</td>
                <td>{c.orderCount}</td>
                <td>{formatPrice(c.total)}</td>
                <td>{c.last ? formatDate(c.last) : "—"}</td>
                <td>
                  {c.tag ? (
                    <span className={`adm-tag tag-${c.tag}`}>
                      {tagLabel(c.tag)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button className="adm-btn" onClick={() => open(c)}>
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="adm-empty">مشتری پیدا نشد</p>}
      </div>

      {selected && (
        <Modal
          title={selected.fullName || selected.username}
          onClose={() => setSelected(null)}
        >
          <div className="adm-grid-2">
            <div>
              <p>نام کاربری: @{selected.username}</p>
              <p>موبایل: {selected.phone || "—"}</p>
              <p>ایمیل: {selected.email || "—"}</p>
              <p>آدرس: {selected.address || "—"}</p>
            </div>
            <div>
              <p>تعداد سفارش: {selected.orderCount}</p>
              <p>مجموع خرید: {formatPrice(selected.total)} تومان</p>
              <p>
                میانگین سفارش:{" "}
                {selected.orderCount
                  ? formatPrice(
                      Math.round(selected.total / selected.orderCount),
                    )
                  : 0}{" "}
                تومان
              </p>
            </div>
          </div>

          <div className="adm-field">
            <label>برچسب</label>
            <select
              className="adm-input"
              value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
            >
              {TAGS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label>یادداشت داخلی</label>
            <textarea
              className="adm-input"
              rows="3"
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              placeholder="مثلاً: ترجیح می‌دهد بدون پیاز سفارش بدهد"
            />
          </div>

          <h4>سفارش‌های این مشتری</h4>
          {history.length === 0 ? (
            <p className="adm-empty">سفارشی ندارد</p>
          ) : (
            <ul className="adm-history">
              {history.slice(0, 8).map((o) => (
                <li key={o.id}>
                  {o.code} · {formatPrice(o.total)}{" "}
                  <StatusBadge status={o.status} />{" "}
                  <small>{formatDateTime(o.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}

          <div className="adm-modal-foot">
            <button className="adm-btn" onClick={() => setSelected(null)}>
              بستن
            </button>
            <button className="adm-btn primary" onClick={save}>
              ذخیره
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CustomersSection;
