import { useState } from "react";
import Swal from "sweetalert2";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "ایمیل نامعتبر",
        text: "لطفاً یک ایمیل معتبر وارد کنید",
        confirmButtonColor: "#ff9600",
        background: "#ffffff",
        color: "#2b2b3a",
      });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    Swal.fire({
      icon: "success",
      title: "عضویت موفق 🎉",
      text: "شما در خبرنامه عضو شدید",
      confirmButtonColor: "#ff9600",
      background: "#ffffff",
      color: "#2b2b3a",
      timer: 2200,
      showConfirmButton: false,
    });

    setEmail("");
  };

  return (
    <div className="footer-section footer-newsletter">
      <h3 className="footer-title">عضویت در خبرنامه</h3>
      <p className="newsletter-text">
        از جدیدترین تخفیف‌ها و محصولات با خبر شوید
      </p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="newsletter-input-wrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل خود را وارد کنید"
            className="newsletter-input"
            aria-label="ایمیل"
          />
          <button type="submit" className="newsletter-btn" disabled={loading}>
            {loading ? "..." : "عضویت"}
          </button>
        </div>
      </form>

      <p className="newsletter-hint">
        🔒 اطلاعات شما امن است و هرگز اسپم نمی‌کنیم
      </p>
    </div>
  );
}

export default FooterNewsletter;
