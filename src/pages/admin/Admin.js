import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCurrentUser, isAdmin, logoutUser } from "../../utils/auth";
import { useOrders } from "../../data/orderStore";
import { useMessages } from "../../data/messageStore";
import { useSettings } from "../../data/settingsStore";
import DashboardSection from "./sections/DashboardSection";
import OrdersSection from "./sections/OrdersSection";
import MenuSection from "./sections/MenuSection";
import ArticlesSection from "./sections/ArticlesSection";
import CustomersSection from "./sections/CustomersSection";
import MessagesSection from "./sections/MessagesSection";
import SettingsSection from "./sections/SettingsSection";
import "./Admin.css";

const SECTIONS = [
  {
    key: "dashboard",
    label: "داشبورد",
    icon: "📊",
    Component: DashboardSection,
  },
  { key: "orders", label: "سفارش‌ها", icon: "🧾", Component: OrdersSection },
  { key: "menu", label: "منوی غذا", icon: "🍔", Component: MenuSection },
  { key: "articles", label: "مقالات", icon: "📝", Component: ArticlesSection },
  {
    key: "customers",
    label: "مشتریان (CRM)",
    icon: "👥",
    Component: CustomersSection,
  },
  { key: "messages", label: "پیام‌ها", icon: "✉️", Component: MessagesSection },
  { key: "settings", label: "تنظیمات", icon: "⚙️", Component: SettingsSection },
];

function Admin() {
  const { section = "dashboard" } = useParams();
  const navigate = useNavigate();
  const orders = useOrders();
  const messages = useMessages();
  const settings = useSettings();
  const user = getCurrentUser();
  const allowed = isAdmin(user);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/admin", { replace: true });
    } else if (!allowed) {
      Swal.fire({
        icon: "error",
        title: "دسترسی ندارید",
        text: "این بخش مخصوص مدیر سایت است",
        confirmButtonColor: "#ff6900",
      }).then(() => navigate("/", { replace: true }));
    }
  }, [user, allowed, navigate]);

  if (!allowed) return null;

  const badges = {
    orders: orders.filter((o) => o.status === "pending").length,
    messages: messages.filter((m) => !m.read).length,
  };
  const current = SECTIONS.find((s) => s.key === section) || SECTIONS[0];
  const Current = current.Component;

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">🍔 {settings.name}</div>
        <nav>
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              to={`/admin/${s.key}`}
              className={`adm-nav-item ${current.key === s.key ? "active" : ""}`}
            >
              <span>
                {s.icon} {s.label}
              </span>
              {badges[s.key] > 0 && (
                <b className="adm-badge">{badges[s.key]}</b>
              )}
            </Link>
          ))}
        </nav>
        <div className="adm-side-foot">
          <Link to="/">← مشاهده سایت</Link>
          <button
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
          >
            خروج
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <h1 className="adm-title">
          {current.icon} {current.label}
        </h1>
        <Current />
      </main>
    </div>
  );
}

export default Admin;
