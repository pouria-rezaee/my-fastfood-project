import { useSettings } from "../../../data/settingsStore";
import "./AboutSection.css";

const STATS = [
  { number: "۱۰+", label: "سال تجربه" },
  { number: "۵۰۰۰+", label: "مشتری راضی" },
  { number: "۵۰+", label: "محصول متنوع" },
];

function AboutSection() {
  const settings = useSettings();

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>درباره {settings.name}</h2>
            <p>
              با بیش از ۱۰ سال تجربه در زمینه تهیه برگرهای باکیفیت، ما افتخار
              داریم که با استفاده از بهترین مواد اولیه و به روزترین تجهیزات، لذت
              واقعی طعم را به شما هدیه دهیم.
            </p>
            <div className="stats">
              {STATS.map((s) => (
                <div key={s.label} className="stat-item">
                  <span className="stat-number">{s.number}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
