import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe, makeId } from "./storage";

const KEY = "messages";

export function getMessages() {
  return readStore(KEY, () => []);
}

export function useMessages() {
  return useSyncExternalStore(subscribe, getMessages);
}

export function addMessage({ name, email, phone, message }) {
  const item = {
    id: makeId("msg"),
    name,
    email,
    phone: phone || "",
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  return writeStore(KEY, [item, ...getMessages()]);
}

export function setMessageRead(id, read = true) {
  return writeStore(
    KEY,
    getMessages().map((m) => (m.id === id ? { ...m, read } : m)),
  );
}

export function deleteMessage(id) {
  return writeStore(
    KEY,
    getMessages().filter((m) => m.id !== id),
  );
}
