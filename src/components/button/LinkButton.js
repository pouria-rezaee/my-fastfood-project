import { NavLink } from "react-router-dom";
import "./LinkButton.css";

// دکمه‌ی لینک‌دار با ظاهر یکدست سایت
// variant: "primary" (توپر نارنجی) | "secondary" (سفید با کادر نارنجی) | "outline" (شفاف)
function LinkButton({
  to,
  variant = "primary",
  icon = false,
  children,
  ...rest
}) {
  return (
    <NavLink to={to} className={`cafe-btn cafe-btn--${variant}`} {...rest}>
      {children}
      {icon && (
        <svg className="cafe-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      )}
    </NavLink>
  );
}

export default LinkButton;
