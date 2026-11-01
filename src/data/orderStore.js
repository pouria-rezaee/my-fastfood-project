import { useMemo, useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe, makeId } from "./storage";

const KEY = "orders";

export const STATUSES = [
  { key: "pending", label: "در انتظار تأیید" },
  { key: "preparing", label: "در حال آماده‌سازی" },
  { key: "delivering", label: "در حال ارسال" },
  { key: "delivered", label: "تحویل داده شد" },
  { key: "cancelled", label: "لغو شده" },
];

export const PAYMENT_LABELS = {
  cod: "پرداخت در محل",
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  refunded: "بازگشت وجه",
};

export function statusLabel(key) {
  const found = STATUSES.find((s) => s.key === key);
  return found ? found.label : key;
}

export function getOrders() {
  return readStore(KEY, () => []);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, getOrders);
}

export function useUserOrders(username) {
  const orders = useOrders();
  return useMemo(
    () => orders.filter((o) => o.username === username),
    [orders, username],
  );
}

export function getOrder(id) {
  return getOrders().find((o) => o.id === id);
}

export function createOrder({
  username,
  customer,
  items,
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
}) {
  const orders = getOrders();
  const number =
    orders.reduce((max, o) => Math.max(max, o.number || 1000), 1000) + 1;
  const now = new Date().toISOString();
  const order = {
    id: makeId("o"),
    number,
    code: `BG-${number}`,
    username,
    fullName: customer.fullName,
    phone: customer.phone,
    address: customer.address,
    note: customer.note || "",
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
    })),
    subtotal,
    deliveryFee,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "online" ? "pending" : "cod",
    status: "pending",
    history: [{ status: "pending", at: now }],
    createdAt: now,
  };
  const res = writeStore(KEY, [order, ...orders]);
  return res.success ? { success: true, order } : res;
}

function patchOrder(id, fn) {
  return writeStore(
    KEY,
    getOrders().map((o) => (o.id === id ? fn(o) : o)),
  );
}

export function updateOrderStatus(id, status) {
  const now = new Date().toISOString();
  return patchOrder(id, (o) => ({
    ...o,
    status,
    history: [...(o.history || []), { status, at: now }],
  }));
}

// لغو توسط مشتری فقط تا قبل از تأیید مجاز است
export function cancelOrder(id) {
  const order = getOrder(id);
  if (!order || order.status !== "pending") {
    return { success: false, message: "این سفارش دیگر قابل لغو نیست" };
  }
  const now = new Date().toISOString();
  return patchOrder(id, (o) => ({
    ...o,
    status: "cancelled",
    paymentStatus: o.paymentStatus === "paid" ? "refunded" : o.paymentStatus,
    history: [...(o.history || []), { status: "cancelled", at: now }],
  }));
}

export function payOrder(id) {
  const ref = "TRX" + Math.floor(100000 + Math.random() * 900000);
  return patchOrder(id, (o) => ({
    ...o,
    paymentStatus: "paid",
    paymentRef: ref,
    paidAt: new Date().toISOString(),
  }));
}
