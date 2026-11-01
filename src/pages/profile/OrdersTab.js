import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StatusBadge from "../../components/statusbadge/StatusBadge";
import {
  useUserOrders,
  cancelOrder,
  PAYMENT_LABELS,
} from "../../data/orderStore";
import { addToCart } from "../../data/cartStore";
import { formatPrice, formatDateTime } from "../../data/format";
import "./OrdersTab.css";
import ProfileCard from "./ProfileCard";

const STEPS = [
  { key: "pending", label: "ثبت شد" },
  { key: "preparing", label: "آماده‌سازی" },
  { key: "delivering", label: "ارسال" },
  { key: "delivered", label: "تحویل" },
];

function Tracker({ status }) {
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="order-tracker">
      {STEPS.map((s, i) => (
        <div key={s.key} className={`order-step ${i <= current ? "done" : ""}`}>
          <span className="order-dot" />
          <small>{s.label}</small>
        </div>
      ))}
    </div>
  );
}

function OrdersTab({ username }) {
  const navigate = useNavigate();
  const orders = useUserOrders(username);

  const handleCancel = async (order) => {
    const res = await Swal.fire({
      icon: "warning",
      title: `لغو سفارش ${order.code}؟`,
      showCancelButton: true,
      confirmButtonText: "بله، لغو شود",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#e63946",
    });
    if (res.isConfirmed) cancelOrder(order.id);
  };

  const handleReorder = (order) => {
    order.items.forEach((i) => addToCart(i.id, i.qty));
    navigate("/cart");
  };

  if (orders.length === 0) {
    return (
      <ProfileCard>
        <p className="profile-empty-orders">هنوز سفارشی ثبت نکرده‌اید.</p>
      </ProfileCard>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-head">
            <div>
              <strong>{order.code}</strong>
              <small>{formatDateTime(order.createdAt)}</small>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {order.status !== "cancelled" && <Tracker status={order.status} />}

          <ul className="order-items">
            {order.items.map((i) => (
              <li key={i.id}>
                {i.name} × {i.qty}
              </li>
            ))}
          </ul>

          <div className="order-foot">
            <div>
              <span className="order-total">
                {formatPrice(order.total)} تومان
              </span>
              <small className="order-pay">
                {PAYMENT_LABELS[order.paymentStatus]}
              </small>
            </div>
            <div className="order-actions">
              {order.paymentStatus === "pending" &&
                order.status !== "cancelled" && (
                  <button
                    className="order-btn primary"
                    onClick={() => navigate(`/payment/${order.id}`)}
                  >
                    پرداخت
                  </button>
                )}
              {order.status === "pending" && (
                <button
                  className="order-btn danger"
                  onClick={() => handleCancel(order)}
                >
                  لغو سفارش
                </button>
              )}
              <button
                className="order-btn"
                onClick={() => handleReorder(order)}
              >
                سفارش مجدد
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersTab;
