import { useState } from "react";
import Swal from "sweetalert2";
import { addMessage } from "../../../data/messageStore";
import "./ContactForm.css";

const EMPTY = { name: "", email: "", phone: "", message: "" };

function ContactForm() {
  const [form, setForm] = useState(EMPTY);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const warn = (title, text) =>
    Swal.fire({ icon: "warning", title, text, confirmButtonColor: "#ff6900" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return warn("اطلاعات ناقص", "لطفاً نام، ایمیل و پیام خود را وارد کنید");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      return warn("ایمیل نامعتبر", "لطفاً یک ایمیل معتبر وارد کنید");
    }

    addMessage(form);
    Swal.fire({
      icon: "success",
      title: "پیام شما ارسال شد",
      text: "به زودی با شما تماس خواهیم گرفت",
      confirmButtonColor: "#ff6900",
    });
    setForm(EMPTY);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>برامون بنویس</h2>
      <p className="contact-form-sub">
        فرم زیر رو پر کن تا پیامت به دست ما برسه.
      </p>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">نام شما</label>
          <input
            id="cf-name"
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="مثلاً: علی رضایی"
          />
        </div>
        <div className="cf-field">
          <label htmlFor="cf-phone">شماره تماس (اختیاری)</label>
          <input
            id="cf-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="09xxxxxxxxx"
          />
        </div>
      </div>

      <div className="cf-field">
        <label htmlFor="cf-email">ایمیل</label>
        <input
          id="cf-email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          dir="ltr"
        />
      </div>

      <div className="cf-field">
        <label htmlFor="cf-message">پیام</label>
        <textarea
          id="cf-message"
          name="message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          placeholder="پیامت رو اینجا بنویس..."
        ></textarea>
      </div>

      <button type="submit" className="cf-submit">
        ارسال پیام
      </button>
    </form>
  );
}

export default ContactForm;
