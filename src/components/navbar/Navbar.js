import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo/hamburger-logos-colorful-burger-logo-for-restaurant-or-cafe-logo-design-template-vector.jpg";
import cartlogo from "../../assets/images/icons/icons8-cart-48.png";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import { useSettings } from "../../data/settingsStore";
import { useCart } from "../../data/cartStore";
import { NAV_LINKS } from "./navLinks";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const settings = useSettings();
  const { count: cartCount } = useCart();
  const [brandFirst, ...brandRest] = settings.name.split(" ");
  // با هر تغییر مسیر، وضعیت ورود دوباره خوانده می‌شود
  const currentUser = getCurrentUser();

  // منوی موبایل با رفتن به صفحه‌ی دیگر بسته می‌شود
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleOrder = () => {
    navigate(currentUser ? "/shop" : "/login");
  };

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <div className="navbar-container">
        <div className="sub-container-left">
          <img src={logo} width={90} alt="لوگو کافه" />
          <h3>
            {brandFirst} <span>{brandRest.join(" ")}</span>
          </h3>
        </div>

        <div className="sub-container-midle">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sub-container-right">
          <div className="icons">
            <NavLink to="/cart" className="cart-link" aria-label="سبد خرید">
              <img className="cart-icon" src={cartlogo} alt="" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          </div>
          <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          <button onClick={handleOrder}>ثبت سفارش</button>
        </div>

        {/* دکمه همبرگر برای موبایل */}
        <button
          className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="منو"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <MobileMenu
        open={isMenuOpen}
        onClose={closeMenu}
        currentUser={currentUser}
        cartCount={cartCount}
        onLogout={handleLogout}
        onOrder={() => {
          closeMenu();
          handleOrder();
        }}
      />
    </>
  );
}

export default Navbar;
