import { getMenu } from "./menuStore";
import { getOrders } from "./orderStore";
import { getSettings } from "./settingsStore";
import { writeStore } from "./storage";
import { seedDemoCustomers } from "../utils/auth";

const DEMO_CUSTOMERS = [
  {
    username: "sara",
    fullName: "سارا محمدی",
    phone: "09121110001",
    address: "تهران، سعادت‌آباد، خیابان سرو، پلاک ۱۲",
  },
  {
    username: "reza",
    fullName: "رضا احمدی",
    phone: "09121110002",
    address: "تهران، ونک، خیابان ملاصدرا، پلاک ۴۵",
  },
  {
    username: "maryam",
    fullName: "مریم کریمی",
    phone: "09121110003",
    address: "تهران، پاسداران، کوچه گلستان، پلاک ۷",
  },
  {
    username: "ali",
    fullName: "علی رضایی",
    phone: "09121110004",
    address: "تهران، تهرانپارس، خیابان ۱۴۰، پلاک ۲۰",
  },
  {
    username: "nima",
    fullName: "نیما صادقی",
    phone: "09121110005",
    address: "تهران، شهرک غرب، بلوار دادمان، پلاک ۳۳",
  },
  {
    username: "zahra",
    fullName: "زهرا حسینی",
    phone: "09121110006",
    address: "تهران، نیاوران، خیابان باهنر، پلاک ۹",
  },
];

const FLOW = ["pending", "preparing", "delivering", "delivered"];
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

// ساخت مشتری و سفارش نمونه برای نمایش بهتر داشبورد در دمو
export function generateDemoData(count = 30) {
  seedDemoCustomers(DEMO_CUSTOMERS);
  const menu = getMenu().filter((m) => m.available !== false);
  if (menu.length === 0) return 0;
  const settings = getSettings();
  const now = Date.now();
  const DAY = 86400000;
  const demo = [];

  for (let i = 0; i < count; i++) {
    const c = pick(DEMO_CUSTOMERS);
    const items = [...menu]
      .sort(() => Math.random() - 0.5)
      .slice(0, 1 + rand(4))
      .map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        qty: 1 + rand(3),
      }));
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const deliveryFee =
      subtotal >= settings.freeDeliveryOver ? 0 : settings.deliveryFee;
    const ageDays = Math.random() * 14;
    const created = now - ageDays * DAY;
    const status =
      ageDays > 2
        ? Math.random() < 0.08
          ? "cancelled"
          : "delivered"
        : pick(FLOW);
    const method = Math.random() < 0.6 ? "online" : "cod";
    const paymentStatus =
      status === "cancelled"
        ? method === "online"
          ? "refunded"
          : "cod"
        : method === "online"
          ? "paid"
          : "cod";

    const steps =
      status === "cancelled"
        ? ["pending", "cancelled"]
        : FLOW.slice(0, FLOW.indexOf(status) + 1);
    const history = steps.map((s, idx) => ({
      status: s,
      at: new Date(created + idx * (15 + rand(20)) * 60000).toISOString(),
    }));

    demo.push({
      id: `demo_${i}_${now.toString(36)}`,
      username: c.username,
      fullName: c.fullName,
      phone: c.phone,
      address: c.address,
      note: "",
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod: method,
      paymentStatus,
      paymentRef:
        paymentStatus === "paid" ? "TRX" + (100000 + rand(900000)) : undefined,
      status,
      history,
      createdAt: new Date(created).toISOString(),
    });
  }

  const existing = getOrders();
  const maxNumber = existing.reduce(
    (m, o) => Math.max(m, o.number || 1000),
    1000,
  );
  demo
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach((o, idx) => {
      o.number = maxNumber + idx + 1;
      o.code = `BG-${o.number}`;
    });

  const all = [...demo, ...existing].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  writeStore("orders", all);
  return demo.length;
}
