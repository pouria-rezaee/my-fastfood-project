import { statusLabel } from "../../data/orderStore";
import "./StatusBadge.css";

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      {statusLabel(status)}
    </span>
  );
}

export default StatusBadge;
