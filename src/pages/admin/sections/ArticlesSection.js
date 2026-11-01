import { useState } from "react";
import {
  useArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  textToBlocks,
  blocksToText,
} from "../../../data/blogStore";
import { imageFor } from "../../../data/images";
import { formatDate } from "../../../data/format";
import { fileToDataUrl } from "../../../utils/imageUpload";
import { Modal, Field, confirmDelete, notify } from "../ui";

const EMPTY = {
  title: "",
  summary: "",
  text: "",
  image: "",
  imageKey: "",
  published: true,
};

function ArticlesSection() {
  const articles = useArticles();
  const [editing, setEditing] = useState(null); // null | "new" | article
  const [form, setForm] = useState(EMPTY);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const openEdit = (a) => {
    setForm({
      title: a.title,
      summary: a.summary,
      text: blocksToText(a.content),
      image: a.image || "",
      imageKey: a.imageKey || "",
      published: a.published !== false,
    });
    setEditing(a);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      set("image", await fileToDataUrl(file, 900));
    } catch (err) {
      notify({ success: false, message: err.message });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim())
      return notify({ success: false, message: "عنوان مقاله را وارد کنید" });
    const content = textToBlocks(form.text);
    if (content.length === 0)
      return notify({ success: false, message: "متن مقاله را بنویسید" });
    const data = {
      title: form.title.trim(),
      summary:
        form.summary.trim() ||
        content.find((b) => b.type === "p")?.text.slice(0, 120) ||
        "",
      content,
      image: form.image,
      imageKey: form.imageKey,
      published: form.published,
    };
    const result =
      editing === "new" ? addArticle(data) : updateArticle(editing.id, data);
    if (notify(result)) setEditing(null);
  };

  const handleDelete = async (a) => {
    if (await confirmDelete(`مقاله‌ی «${a.title}» حذف می‌شود`)) {
      notify(deleteArticle(a.id), "حذف شد");
    }
  };

  return (
    <>
      <div className="adm-toolbar">
        <span />
        <button className="adm-btn primary" onClick={openNew}>
          + مقاله‌ی جدید
        </button>
      </div>

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th></th>
              <th>عنوان</th>
              <th>تاریخ</th>
              <th>منتشر شده</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td>
                  <img className="adm-thumb" src={imageFor(a)} alt="" />
                </td>
                <td>{a.title}</td>
                <td>{formatDate(a.createdAt)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={a.published !== false}
                    onChange={(e) =>
                      updateArticle(a.id, { published: e.target.checked })
                    }
                  />
                </td>
                <td className="adm-actions">
                  <button className="adm-btn" onClick={() => openEdit(a)}>
                    ویرایش
                  </button>
                  <button
                    className="adm-btn danger"
                    onClick={() => handleDelete(a)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <p className="adm-empty">مقاله‌ای وجود ندارد</p>
        )}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "مقاله‌ی جدید" : "ویرایش مقاله"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSave}>
            <Field label="عنوان">
              <input
                className="adm-input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
            <Field label="خلاصه (اختیاری)">
              <textarea
                className="adm-input"
                rows="2"
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </Field>
            <Field label="متن مقاله">
              <textarea
                className="adm-input"
                rows="9"
                value={form.text}
                onChange={(e) => set("text", e.target.value)}
              />
              <small className="adm-hint">
                بین پاراگراف‌ها یک خط خالی بگذار. خطی که با «## » شروع شود عنوان
                می‌شود و خط‌هایی که با «- » شروع شوند لیست می‌شوند.
              </small>
            </Field>
            <Field label="عکس">
              <div className="adm-upload">
                <img src={imageFor(form)} alt="" />
                <input type="file" accept="image/*" onChange={handleFile} />
              </div>
            </Field>
            <label className="adm-check">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              منتشر شود
            </label>
            <div className="adm-modal-foot">
              <button
                type="button"
                className="adm-btn"
                onClick={() => setEditing(null)}
              >
                انصراف
              </button>
              <button type="submit" className="adm-btn primary">
                ذخیره
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default ArticlesSection;
