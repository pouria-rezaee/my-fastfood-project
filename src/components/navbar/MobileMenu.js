import { NavLink } from "react-router-dom";
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
            <img style={{ width: 25 }} src={cartlogo} alt="سبد خرید" />
            <span>سبد خرید {cartCount > 0 && `(${cartCount})`}</span>
          </NavLink>

          {currentUser ? (
            <div className="mobile-user">
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
