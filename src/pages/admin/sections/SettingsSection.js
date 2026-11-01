import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSettings, saveSettings } from "../../../data/settingsStore";
import { generateDemoData } from "../../../data/demoData";
import { writeStore, resetStores } from "../../../data/storage";
import { Field, notify } from "../ui";

function SettingsSection() {
  const settings = useSettings();
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const text = (name, label) => (
    <Field label={label}>
      <input
        className="adm-input"
        value={form[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
      />
    </Field>
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim())
      return notify({
        success: false,
        message: "نام کافه نمی‌تواند خالی باشد",
      });
    notify(
      saveSettings({
        ...form,
        name: form.name.trim(),
        deliveryFee: Number(form.deliveryFee) || 0,
        freeDeliveryOver: Number(form.freeDeliveryOver) || 0,
      }),
    );
  };

  const confirm = async (title, text) =>
    (
      await Swal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "بله",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#e63946",
      })
    ).isConfirmed;

  const handleDemo = () => {
    const n = generateDemoData(30);
    notify({ success: true }, `${n} سفارش نمونه ساخته شد`);
  };

  const handleClearOrders = async () => {
    if (
      await confirm("حذف همه‌ی سفارش‌ها و پیام‌ها؟", "این کار قابل بازگشت نیست")
    ) {
      writeStore("orders", []);
      writeStore("messages", []);
      notify({ success: true }, "پاک شد");
    }
  };

  const handleReset = async () => {
    if (
      await confirm(
        "بازنشانی منو، مقالات و تنظیمات؟",
        "همه‌ی تغییرات شما روی این بخش‌ها به حالت اول برمی‌گردد",
      )
    ) {
      resetStores();
      notify({ success: true }, "بازنشانی شد");
    }
  };

  return (
    <>
      <form className="adm-card" onSubmit={handleSave}>
        <h3>اطلاعات کافه</h3>
        <div className="adm-grid-2">
          {text(
            "name",
            "نام کافه (کلمه‌ی آخر با رنگ نارنجی نمایش داده می‌شود)",
          )}
          {text("tagline", "شعار (فوتر)")}
          {text("address", "آدرس")}
          {text("hours", "ساعت کاری")}
          {text("phone", "تلفن")}
          {text("mobile", "موبایل")}
          {text("email", "ایمیل")}
          {text("supportEmail", "ایمیل پشتیبانی")}
        </div>
        <h3>ارسال</h3>
        <div className="adm-grid-2">
          <Field label="هزینه ارسال (تومان)">
            <input
              type="number"
              min="0"
              className="adm-input"
              value={form.deliveryFee}
              onChange={(e) => set("deliveryFee", e.target.value)}
            />
          </Field>
          <Field label="ارسال رایگان برای خرید بالای (تومان)">
            <input
              type="number"
              min="0"
              className="adm-input"
              value={form.freeDeliveryOver}
              onChange={(e) => set("freeDeliveryOver", e.target.value)}
            />
          </Field>
        </div>
        <button type="submit" className="adm-btn primary">
          ذخیره تنظیمات
        </button>
      </form>

      <div className="adm-card">
        <h3>ابزار دمو</h3>
        <p className="adm-hint">برای نمایش بهتر داشبورد و CRM در جلسه‌ی دمو.</p>
        <div className="adm-actions">
          <button className="adm-btn primary" onClick={handleDemo}>
            ساخت ۳۰ سفارش و ۶ مشتری نمونه
          </button>
          <button className="adm-btn danger" onClick={handleClearOrders}>
            حذف همه‌ی سفارش‌ها و پیام‌ها
          </button>
          <button className="adm-btn danger" onClick={handleReset}>
            بازنشانی منو، مقالات و تنظیمات
          </button>
        </div>
      </div>
    </>
  );
}

export default SettingsSection;
