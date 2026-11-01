import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
} from "../../utils/auth";
import { useCart, clearCart, calcTotals } from "../../data/cartStore";
import { useSettings } from "../../data/settingsStore";
import { createOrder } from "../../data/orderStore";
import { formatPrice, toEnglishDigits } from "../../data/format";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const settings = useSettings();
  const { deliveryFee, total } = calcTotals(subtotal, settings);
  const [username, setUsername] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login?redirect=/checkout", { replace: true });
      return;
    }
    setUsername(user);
    const profile = getUserProfile(user);
    if (profile) {
      setForm((f) => ({
        ...f,
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      }));
    }
  }, [navigate]);

  useEffect(() => {
    if (username && items.length === 0 && !placing) {
      navigate("/cart", { replace: true });
    }
  }, [username, items.length, placing, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const warn = (text) =>
    Swal.fire({
      icon: "warning",
      title: "اطلاعات ناقص",
      text,
      confirmButtonColor: "#ff6900",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = toEnglishDigits(form.phone).trim();
    if (!form.fullName.trim()) return warn("نام و نام خانوادگی را وارد کنید");
    if (!/^09\d{9}$/.test(phone))
      return warn("شماره موبایل باید به شکل 09123456789 باشد");
    if (form.address.trim().length < 10)
      return warn("آدرس را کامل‌تر وارد کنید");

    setPlacing(true);
    const result = createOrder({
      username,
      customer: { ...form, phone },
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    });
    if (!result.success) {
      setPlacing(false);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: result.message,
        confirmButtonColor: "#ff6900",
      });
      return;
    }

    // اگر پروفایل خالی بود، اطلاعات همین سفارش در آن ذخیره می‌شود
    const profile = getUserProfile(username);
    if (profile && !profile.phone && !profile.address) {
      updateUserProfile(username, {
        fullName: profile.fullName || form.fullName,
        phone,
        address: form.address,
      });
    }

    clearCart();
    const order = result.order;
    if (paymentMethod === "online") {
      navigate(`/payment/${order.id}`, { replace: true });
    } else {
      Swal.fire({
        icon: "success",
        title: "سفارش ثبت شد",
        html: `کد پیگیری: <b>${order.code}</b><br/>پرداخت هنگام تحویل انجام می‌شود`,
        confirmButtonColor: "#ff6900",
      }).then(() => navigate("/profile?tab=orders", { replace: true }));
    }
  };

  if (!username) return null;

  return (
    <>
      <div className="checkout-page">
        <h1 className="checkout-title">ثبت سفارش</h1>
        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-card">
            <h2>اطلاعات تحویل</h2>
            <div className="checkout-group">
              <label>نام و نام خانوادگی</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="checkout-group">
              <label>شماره موبایل</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="09123456789"
              />
            </div>
            <div className="checkout-group">
              <label>آدرس</label>
              <textarea
                name="address"
                rows="3"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="checkout-group">
              <label>توضیحات (اختیاری)</label>
              <textarea
                name="note"
                rows="2"
                value={form.note}
                onChange={handleChange}
                placeholder="مثلاً: بدون پیاز"
              />
            </div>

            <h2>روش پرداخت</h2>
            <label
              className={`pay-option ${paymentMethod === "online" ? "active" : ""}`}
            >
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <span>پرداخت آنلاین (درگاه آزمایشی)</span>
            </label>
            <label
              className={`pay-option ${paymentMethod === "cod" ? "active" : ""}`}
            >
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>پرداخت در محل</span>
            </label>
          </div>

          <aside className="checkout-card checkout-summary">
            <h2>خلاصه سفارش</h2>
            {items.map((i) => (
              <div key={i.id} className="checkout-line">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{formatPrice(i.lineTotal)}</span>
              </div>
            ))}
            <div className="checkout-line checkout-sep">
              <span>جمع غذاها</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-line">
              <span>هزینه ارسال</span>
              <span>
                {deliveryFee === 0 ? "رایگان" : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="checkout-line checkout-total">
              <span>قابل پرداخت</span>
              <span>{formatPrice(total)} تومان</span>
            </div>
            <button
              type="submit"
              className="checkout-submit"
              disabled={placing}
            >
              {paymentMethod === "online"
                ? "ثبت و رفتن به پرداخت"
                : "ثبت سفارش"}
            </button>
          </aside>
        </form>
      </div>
    </>
  );
}

export default Checkout;
