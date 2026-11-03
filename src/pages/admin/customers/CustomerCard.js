import { tagLabel } from "../../../data/crmStore";
import { formatPrice, formatDate } from "../../../data/format";
import { fa } from "../../../utils/jalali";
import "./CustomerCard.css";

const GRADIENTS = [
  ["#ff9248", "#ff6900"],
  ["#2a9d8f", "#1f7a70"],
  ["#6c63ff", "#4b44cc"],
  ["#e76f51", "#c4492c"],
  ["#d4a017", "#a87c0c"],
  ["#3a86ff", "#2563c9"],
];

export function avatarStyle(seed) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = GRADIENTS[h % GRADIENTS.length];
  return { background: `linear-gradient(135deg, ${a}, ${b})` };
}

function CustomerCard({ customer: c, onOpen }) {
  const name = c.fullName || c.username;

  return (
    <button type="button" className="cc" onClick={() => onOpen(c)}>
      <span className="cc-top">
        <span className="cc-avatar" style={avatarStyle(c.username)}>
          {name.charAt(0)}
        </span>
        <span className="cc-id">
          <b>{name}</b>
          <small dir="ltr" className="cc-user">
            @{c.username}
          </small>
        </span>
        {c.tag && (
          <span className={`adm-tag tag-${c.tag}`}>{tagLabel(c.tag)}</span>
        )}
      </span>

      <span className="cc-stats">
        <span>
          <small>سفارش</small>
          <b>{fa(c.orderCount)}</b>
        </span>
        <span>
          <small>مجموع خرید</small>
          <b>{formatPrice(c.total)}</b>
        </span>
        <span>
          <small>آخرین سفارش</small>
          <b>{c.last ? formatDate(c.last) : "—"}</b>
        </span>
      </span>

      <span className="cc-foot">
        <span dir="ltr">{c.phone || "شماره ثبت نشده"}</span>
        <span className="cc-more">مشاهده ‹</span>
      </span>
    </button>
  );
}

export default CustomerCard;
