import { useSyncExternalStore } from "react";
import { readStore, writeStore, subscribe, makeId } from "./storage";
import { infos } from "../pages/blog/blogData/BlogData";
import { imageKeyByUrl } from "./images";

const KEY = "blog";

const seed = () =>
  infos.map((a) => ({
    id: String(a.id),
    title: a.title,
    summary: a.summary,
    imageKey: imageKeyByUrl(a.image),
    image: "",
    content: a.content,
    published: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  }));

export function getArticles() {
  return readStore(KEY, seed);
}

export function useArticles() {
  return useSyncExternalStore(subscribe, getArticles);
}

export function addArticle(data) {
  const article = {
    id: makeId("a"),
    imageKey: "",
    image: "",
    published: true,
    ...data,
    createdAt: new Date().toISOString(),
  };
  return writeStore(KEY, [article, ...getArticles()]);
}

export function updateArticle(id, patch) {
  return writeStore(
    KEY,
    getArticles().map((a) => (a.id === id ? { ...a, ...patch } : a)),
  );
}

export function deleteArticle(id) {
  return writeStore(
    KEY,
    getArticles().filter((a) => a.id !== id),
  );
}

// تبدیل متن ساده (که مالک سایت تایپ می‌کند) به بلاک‌های مقاله
//  خط خالی = پاراگراف جدا | خط شروع‌شونده با ## = عنوان | خط شروع‌شونده با - = لیست
export function textToBlocks(text) {
  const blocks = [];
  String(text || "")
    .split(/\n\s*\n/)
    .forEach((chunk) => {
      const lines = chunk
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (!lines.length) return;
      if (lines[0].startsWith("## ")) {
        blocks.push({ type: "h3", text: lines[0].slice(3) });
        lines.shift();
        if (!lines.length) return;
      }
      if (lines.every((l) => l.startsWith("- "))) {
        blocks.push({ type: "ul", items: lines.map((l) => l.slice(2)) });
      } else {
        blocks.push({ type: "p", text: lines.join(" ") });
      }
    });
  return blocks;
}

export function blocksToText(blocks) {
  return (blocks || [])
    .map((b) => {
      if (b.type === "h3") return `## ${b.text}`;
      if (b.type === "ul") return b.items.map((i) => `- ${i}`).join("\n");
      return b.text;
    })
    .join("\n\n");
}
