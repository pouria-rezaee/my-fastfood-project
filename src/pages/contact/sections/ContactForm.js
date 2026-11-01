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
    Swal.fire({ icon: "warning", title, text, confirmButtonColor: "#ff6b35" });

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
      confirmButtonColor: "#ff6b35",
    });
    setForm(EMPTY);
  };

  return (
    <div className="contact-form">
      <h2>پیام بدهید</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="نام شما"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ایمیل شما"
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="شماره تماس"
          />
        </div>

        <div className="form-group">
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="پیام شما..."
            rows="5"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          ارسال پیام
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
