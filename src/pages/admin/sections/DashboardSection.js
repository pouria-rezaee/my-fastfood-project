import { Link } from "react-router-dom";
import StatusBadge from "../../../components/statusbadge/StatusBadge";
import { useOrders } from "../../../data/orderStore";
import { useMenu } from "../../../data/menuStore";
import { useMessages } from "../../../data/messageStore";
import { getAllUsers } from "../../../utils/auth";
import { formatPrice, formatDateTime } from "../../../data/format";
import "./DashboardSection.css";

function DashboardSection() {
  const orders = useOrders();
  const menu = useMenu();
  const messages = useMessages();
  const customers = getAllUsers().filter((u) => u.role !== "admin");

  const valid = orders.filter((o) => o.status !== "cancelled");
  const sum = (list) => list.reduce((s, o) => s + o.total, 0);
  const todayStr = new Date().toDateString();
  const todayOrders = valid.filter(
    (o) => new Date(o.createdAt).toDateString() === todayStr,
  );

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    days.push({
      label: d.toLocaleDateString("fa-IR", { weekday: "short" }),
      total: sum(
        valid.filter((o) => new Date(o.createdAt).toDateString() === key),
      ),
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  const sold = {};
  valid.forEach((o) =>
    o.items.forEach((i) => {
      sold[i.name] = (sold[i.name] || 0) + i.qty;
    }),
  );
  const top = Object.entries(sold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    {
      label: "سفارش‌های امروز",
      value: todayOrders.length,
      sub: `${formatPrice(sum(todayOrders))} تومان`,
    },
    {
      label: "در انتظار تأیید",
      value: orders.filter((o) => o.status === "pending").length,
      sub: "نیاز به بررسی",
    },
    {
      label: "کل فروش",
      value: formatPrice(sum(valid)),
      sub: `${valid.length} سفارش موفق`,
    },
    {
      label: "مشتریان",
      value: customers.length,
      sub: `${menu.length} غذا در منو`,
    },
    {
      label: "پیام‌های جدید",
      value: messages.filter((m) => !m.read).length,
      sub: `${messages.length} پیام کل`,
    },
  ];

  return (
    <>
      <div className="adm-stats">
        {stats.map((s) => (
          <div key={s.label} className="adm-stat">
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            <small>{s.sub}</small>
          </div>
        ))}
      </div>

      <div className="adm-two-col">
        <div className="adm-card">
          <h3>فروش ۷ روز اخیر</h3>
          <div className="adm-chart">
            {days.map((d, i) => (
              <div
                key={i}
                className="adm-bar-wrap"
                title={`${formatPrice(d.total)} تومان`}
              >
                <div
                  className="adm-bar"
                  style={{ height: `${(d.total / maxDay) * 100}%` }}
                />
                <small>{d.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h3>پرفروش‌ترین غذاها</h3>
          {top.length === 0 ? (
            <p className="adm-empty">هنوز فروشی ثبت نشده است</p>
          ) : (
            <ol className="adm-top">
              {top.map(([name, qty]) => (
                <li key={name}>
                  <span>{name}</span>
                  <b>{qty} عدد</b>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>آخرین سفارش‌ها</h3>
          <Link to="/admin/orders">مشاهده همه</Link>
        </div>
        {orders.length === 0 ? (
          <p className="adm-empty">
            هنوز سفارشی ثبت نشده است. از بخش «تنظیمات» می‌توانید داده‌ی نمونه
            بسازید.
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>کد</th>
                  <th>مشتری</th>
                  <th>تاریخ</th>
                  <th>مبلغ</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.code}</td>
                    <td>{o.fullName}</td>
                    <td>{formatDateTime(o.createdAt)}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardSection;
