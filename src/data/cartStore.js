import { useMemo, useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe } from "./storage";
import { useMenu } from "./menuStore";

const KEY = "cart";

// در سبد فقط { id, qty } ذخیره می‌شود؛ نام و قیمت همیشه از منوی فعلی خوانده می‌شود
export function getCartLines() {
  return readStore(KEY, () => []);
}

export function addToCart(id, qty = 1) {
  const lines = getCartLines();
  const exists = lines.find((l) => l.id === id);
  const next = exists
    ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
    : [...lines, { id, qty }];
  return writeStore(KEY, next);
}

export function setQty(id, qty) {
  if (qty <= 0) return removeFromCart(id);
  return writeStore(
    KEY,
    getCartLines().map((l) => (l.id === id ? { ...l, qty } : l)),
  );
}

export function removeFromCart(id) {
  return writeStore(
    KEY,
    getCartLines().filter((l) => l.id !== id),
  );
}

export function clearCart() {
  return writeStore(KEY, []);
}

export function calcTotals(subtotal, settings) {
  const fee = Number(settings?.deliveryFee) || 0;
  const freeOver = Number(settings?.freeDeliveryOver) || 0;
  const deliveryFee =
    subtotal === 0 || (freeOver > 0 && subtotal >= freeOver) ? 0 : fee;
  return { deliveryFee, total: subtotal + deliveryFee };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getCartLines);
  const menu = useMenu();

  return useMemo(() => {
    const items = lines
      .map((l) => {
        const food = menu.find((m) => m.id === l.id);
        return food
          ? { ...food, qty: l.qty, lineTotal: food.price * l.qty }
          : null;
      })
      .filter((i) => i && i.available !== false);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    return { items, count, subtotal };
  }, [lines, menu]);
}
