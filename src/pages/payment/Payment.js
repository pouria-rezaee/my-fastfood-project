import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../utils/auth";
import { getOrder, payOrder } from "../../data/orderStore";
import { formatPrice } from "../../data/format";
import "./Payment.css";

// درگاه پرداخت آزمایشی: هیچ پولی کسر نمی‌شود
function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate(`/login?redirect=/payment/${id}`, { replace: true });
      return;
    }
    const found = getOrder(id);
    if (
      !found ||
      found.username !== user ||
      found.paymentStatus !== "pending"
    ) {
      navigate("/profile?tab=orders", { replace: true });
      return;
    }
    setOrder(found);
  }, [id, navigate]);

  const handlePay = () => {
    setBusy(true);
    setTimeout(() => {
      payOrder(order.id);
      Swal.fire({
        icon: "success",
        title: "پرداخت موفق",
        html: `سفارش <b>${order.code}</b> با موفقیت ثبت و پرداخت شد`,
        confirmButtonColor: "#ff6900",
      }).then(() => navigate("/profile?tab=orders", { replace: true }));
    }, 1500);
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "پرداخت انجام نشد",
      text: "سفارش شما ثبت شده است و می‌توانید از «سفارش‌های من» پرداخت را انجام دهید",
      confirmButtonColor: "#ff6900",
    }).then(() => navigate("/profile?tab=orders", { replace: true }));
  };

  if (!order) return null;

  return (
    <div className="pay-page">
      <div className="pay-box">
        <div className="pay-demo">
          نسخه دمو؛ هیچ مبلغی از حساب شما کسر نمی‌شود
        </div>
        <h2>درگاه پرداخت آزمایشی</h2>
        <div className="pay-amount">
          <span>مبلغ قابل پرداخت</span>
          <strong>{formatPrice(order.total)} تومان</strong>
        </div>
        <div className="pay-field">
          <label>شماره کارت</label>
          <input defaultValue="6037-9911-2233-4455" />
        </div>
        <div className="pay-row">
          <div className="pay-field">
            <label>CVV2</label>
            <input defaultValue="123" />
          </div>
          <div className="pay-field">
            <label>تاریخ انقضا</label>
            <input defaultValue="12/05" />
          </div>
        </div>
        <button className="pay-btn" onClick={handlePay} disabled={busy}>
          {busy ? "در حال پردازش..." : "پرداخت"}
        </button>
        <button className="pay-cancel" onClick={handleCancel} disabled={busy}>
          انصراف
        </button>
      </div>
    </div>
  );
}

export default Payment;
