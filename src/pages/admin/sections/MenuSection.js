import { useState } from "react";
import {
  useMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  CATEGORIES,
  categoryLabel,
} from "../../../data/menuStore";
import { imageFor } from "../../../data/images";
import { formatPrice } from "../../../data/format";
import { fileToDataUrl } from "../../../utils/imageUpload";
import { Modal, Field, confirmDelete, notify } from "../ui";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "burger",
  available: true,
  image: "",
  imageKey: "",
};

function MenuSection() {
  const menu = useMenu();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [form, setForm] = useState(EMPTY);

  const list = menu.filter((m) => m.name.includes(query.trim()));

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const openEdit = (item) => {
    setForm({ ...item, price: String(item.price) });
    setEditing(item);
  };
  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      set("image", await fileToDataUrl(file));
    } catch (err) {
      notify({ success: false, message: err.message });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim())
      return notify({ success: false, message: "نام غذا را وارد کنید" });
    if (!(Number(form.price) > 0))
      return notify({ success: false, message: "قیمت معتبر وارد کنید" });
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      available: form.available,
      image: form.image,
      imageKey: form.imageKey,
    };
    const result =
      editing === "new" ? addMenuItem(data) : updateMenuItem(editing.id, data);
    if (notify(result)) setEditing(null);
  };

  const handleDelete = async (item) => {
    if (await confirmDelete(`«${item.name}» از منو حذف می‌شود`)) {
      notify(deleteMenuItem(item.id), "حذف شد");
    }
  };

  return (
    <>
      <div className="adm-toolbar">
        <input
          className="adm-input"
          placeholder="جستجوی نام غذا"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="adm-btn primary" onClick={openNew}>
          + غذای جدید
        </button>
      </div>

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th></th>
              <th>نام</th>
              <th>دسته</th>
              <th>قیمت (تومان)</th>
              <th>موجود</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>
                  <img className="adm-thumb" src={imageFor(m)} alt="" />
                </td>
                <td>{m.name}</td>
                <td>{categoryLabel(m.category)}</td>
                <td>{formatPrice(m.price)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={m.available !== false}
                    onChange={(e) =>
                      updateMenuItem(m.id, { available: e.target.checked })
                    }
                  />
                </td>
                <td className="adm-actions">
                  <button className="adm-btn" onClick={() => openEdit(m)}>
                    ویرایش
                  </button>
                  <button
                    className="adm-btn danger"
                    onClick={() => handleDelete(m)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="adm-empty">غذایی پیدا نشد</p>}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "غذای جدید" : "ویرایش غذا"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={handleSave}>
            <Field label="نام غذا">
              <input
                className="adm-input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="توضیحات">
              <textarea
                className="adm-input"
                rows="2"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <div className="adm-grid-2">
              <Field label="قیمت (تومان)">
                <input
                  type="number"
                  min="0"
                  className="adm-input"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>
              <Field label="دسته‌بندی">
                <select
                  className="adm-input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="عکس">
              <div className="adm-upload">
                <img src={imageFor(form)} alt="" />
                <input type="file" accept="image/*" onChange={handleFile} />
              </div>
            </Field>
            <label className="adm-check">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => set("available", e.target.checked)}
              />
              موجود است
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

export default MenuSection;
