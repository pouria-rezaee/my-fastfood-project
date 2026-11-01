import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../utils/auth";
import {
  useCart,
  setQty,
  removeFromCart,
  clearCart,
  calcTotals,
} from "../../data/cartStore";
import { useSettings } from "../../data/settingsStore";
import { imageFor } from "../../data/images";
import { formatPrice } from "../../data/format";
import "./Cart.css";

function Cart() {
  const { items, count, subtotal } = useCart();
  const settings = useSettings();
  const navigate = useNavigate();
  const { deliveryFee, total } = calcTotals(subtotal, settings);
  const missingForFree =
    settings.freeDeliveryOver - subtotal > 0 && subtotal > 0
      ? settings.freeDeliveryOver - subtotal
      : 0;

  const handleClear = async () => {
    const res = await Swal.fire({
      icon: "question",
      title: "خالی کردن سبد خرید؟",
      showCancelButton: true,
      confirmButtonText: "بله، خالی کن",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#ff6900",
    });
    if (res.isConfirmed) clearCart();
  };

  const handleCheckout = () => {
    if (!getCurrentUser()) {
      Swal.fire({
        icon: "info",
        title: "ابتدا وارد شوید",
        text: "برای ثبت سفارش باید وارد حساب کاربری شوید",
        confirmButtonText: "ورود / ثبت نام",
        confirmButtonColor: "#ff6900",
      }).then(() => navigate("/login?redirect=/checkout"));
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <div className="cart-page">
        <h1 className="cart-title">🛒 سبد خرید</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>سبد خرید شما خالی است</p>
            <Link to="/shop" className="cart-btn-primary">
              مشاهده منو
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <img src={imageFor(item)} alt={item.name} />
                  <div className="cart-row-info">
                    <h3>{item.name}</h3>
                    <span>{formatPrice(item.price)} تومان</span>
                  </div>
                  <div className="cart-qty">
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="افزایش"
                    >
                      +
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="کاهش"
                    >
                      −
                    </button>
                  </div>
                  <div className="cart-row-total">
                    {formatPrice(item.lineTotal)}
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="حذف"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button className="cart-clear" onClick={handleClear}>
                خالی کردن سبد
              </button>
            </div>

            <aside className="cart-summary">
              <h2>خلاصه سفارش</h2>
              <div className="cart-line">
                <span>تعداد اقلام</span>
                <span>{count}</span>
              </div>
              <div className="cart-line">
                <span>جمع کل غذاها</span>
                <span>{formatPrice(subtotal)} تومان</span>
              </div>
              <div className="cart-line">
                <span>هزینه ارسال</span>
                <span>
                  {deliveryFee === 0
                    ? "رایگان"
                    : `${formatPrice(deliveryFee)} تومان`}
                </span>
              </div>
              {missingForFree > 0 && (
                <p className="cart-hint">
                  با {formatPrice(missingForFree)} تومان خرید بیشتر، ارسال
                  رایگان می‌شود
                </p>
              )}
              <div className="cart-line cart-total">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(total)} تومان</span>
              </div>
              <button className="cart-btn-primary" onClick={handleCheckout}>
                ادامه و ثبت سفارش
              </button>
              <Link to="/shop" className="cart-continue">
                ادامه خرید
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
