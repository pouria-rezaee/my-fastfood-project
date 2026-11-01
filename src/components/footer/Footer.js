import { Link } from "react-router-dom";
import "./Footer.css";
import { useSettings } from "../../data/settingsStore";
import FooterNewsletter from "./FooterNewsletter";

const QUICK_LINKS = [
  { to: "/", label: "صفحه اصلی" },
  { to: "/shop", label: "فروشگاه" },
  { to: "/about", label: "درباره ما" },
  { to: "/contact", label: "تماس با ما" },
];

function Footer() {
  const settings = useSettings();
  const [brandFirst, ...brandRest] = settings.name.split(" ");

  const contacts = [
    { icon: "📍", text: settings.address, href: null },
    { icon: "📞", text: settings.phone, href: `tel:${settings.phone}` },
    { icon: "✉️", text: settings.email, href: `mailto:${settings.email}` },
    { icon: "🕒", text: settings.hours, href: null },
  ];

  return (
    <footer className="footer">
      {/* Wave */}
      <div className="waves" aria-hidden="true">
        <div className="wave1"></div>
      </div>

      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* About */}
            <div className="footer-section footer-about">
              <div className="footer-logo">
                <h2>
                  {brandFirst}{" "}
                  <span className="logo-accent">{brandRest.join(" ")}</span>
                </h2>
                <p>{settings.tagline}</p>
              </div>

              <div className="footer-socials">
                <a href="#" aria-label="اینستاگرام" className="social-link">
                  📷
                </a>
                <a href="#" aria-label="تلگرام" className="social-link">
                  ✈️
                </a>
                <a href="#" aria-label="واتساپ" className="social-link">
                  💬
                </a>
                <a href="#" aria-label="لینکدین" className="social-link">
                  💼
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">لینک‌های سریع</h3>
              <ul className="footer-links">
                {QUICK_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">اطلاعات تماس</h3>
              <div className="contact-info">
                {contacts.map((c, i) => (
                  <div key={i} className="contact-item">
                    <span className="contact-icon">{c.icon}</span>
                    {c.href ? (
                      <a href={c.href} className="contact-link">
                        {c.text}
                      </a>
                    ) : (
                      <span>{c.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <FooterNewsletter />
          </div>

          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} {settings.name} — تمامی حقوق محفوظ
              است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
