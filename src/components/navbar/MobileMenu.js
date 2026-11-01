import { NavLink } from "react-router-dom";
import { isAdmin } from "../../utils/auth";
import cartlogo from "../../assets/images/icons/icons8-cart-48.png";
import { NAV_LINKS } from "./navLinks";
import "./MobileMenu.css";

function MobileMenu({
  open,
  onClose,
  currentUser,
  cartCount,
  onLogout,
  onOrder,
}) {
  return (
    <>
      <div
        className={`mobile-menu-overlay ${open ? "active" : ""}`}
        onClick={onClose}
      ></div>

      <div className={`mobile-menu ${open ? "active" : ""}`}>
        <button
          className="mobile-close"
          onClick={onClose}
          aria-label="بستن منو"
        >
          ✕
        </button>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} onClick={onClose}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-actions">
          <NavLink to="/cart" className="mobile-cart" onClick={onClose}>
            <img src={cartlogo} alt="" />
            <span>سبد خرید {cartCount > 0 && `(${cartCount})`}</span>
          </NavLink>

          {currentUser ? (
            <div className="mobile-user">
              {isAdmin(currentUser) && (
                <NavLink to="/admin" onClick={onClose}>
                  ⚙️ پنل مدیریت
                </NavLink>
              )}
              <NavLink to="/profile" onClick={onClose}>
                👤 {currentUser}
              </NavLink>
              <button className="mobile-order-btn" onClick={onLogout}>
                خروج
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              className="mobile-login-link"
            >
              ورود / ثبت نام
            </NavLink>
          )}

          <button className="mobile-order-btn" onClick={onOrder}>
            ثبت سفارش
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
