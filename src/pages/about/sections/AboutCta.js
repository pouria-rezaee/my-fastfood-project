import LinkButton from "../../../components/button/LinkButton";
import "./AboutCta.css";

function AboutCta() {
  return (
    <section className="about-cta">
      <div className="container">
        <div className="about-cta-box">
          <div>
            <h2>گرسنه‌اید؟ ما آماده‌ایم</h2>
            <p>منو رو ببینید و تا ۳۰ دقیقه‌ی دیگه سفارشتون رو تحویل بگیرید.</p>
          </div>
          <div className="about-cta-actions">
            <LinkButton to="/shop" variant="primary" icon>
              مشاهده منو
            </LinkButton>
            <LinkButton to="/contact" variant="secondary">
              تماس با ما
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutCta;
