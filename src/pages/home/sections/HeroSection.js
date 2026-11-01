import LinkButton from "../../../components/button/LinkButton";
// import HeroFeatures from "./HeroFeatures";
import HeroImage from "./HeroImage";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <HeroImage />

          <div className="hero-text">
            <h1 className="hero-title">
              <span>برگرهای خوشمزه</span>
              <br />
              <span className="highlight">برای لحظات خاص</span>
            </h1>
            <p className="hero-description">
              با مواد اولیه تازه و باکیفیت، هر گاز یک تجربه بی‌نظیر از طعم‌های
              خاص و منحصر به فرد
            </p>
            <div className="hero-actions">
              <LinkButton to="/shop" variant="primary" icon>
                سفارش آنلاین
              </LinkButton>
              <LinkButton to="/shop" variant="secondary">
                مشاهده منو
              </LinkButton>
            </div>

            {/* <HeroFeatures /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
