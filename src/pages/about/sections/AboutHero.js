import burger from "../../../assets/images/img/chicken-fillet-burger.jpg";
import lasagne from "../../../assets/images/img/lasagne.jpg";
import sticks from "../../../assets/images/img/mozzarella-sticks.jpg";
import { useSettings } from "../../../data/settingsStore";
import "./AboutHero.css";

const STATS = [
  { number: "۱۰+", label: "سال تجربه" },
  { number: "۵۰۰۰+", label: "مشتری راضی" },
  { number: "۵۰+", label: "محصول متنوع" },
];

function AboutHero() {
  const settings = useSettings();

  return (
    <section className="about-hero">
      <div className="container">
        <div className="about-hero-grid">
          <div className="about-hero-text">
            <span className="eyebrow">درباره‌ی {settings.name}</span>
            <h1>
              طعمی که با <em>عشق</em> و مواد تازه ساخته می‌شه
            </h1>
            <p>
              ما فقط غذا نمی‌پزیم؛ تلاش می‌کنیم هر سفارش، یه لحظه‌ی خوب برای شما
              بسازه. از انتخاب مواد اولیه‌ی تازه تا بسته‌بندی و تحویل، همه‌ی
              مراحل زیر نظر خودمونه.
            </p>
            <div className="about-hero-stats">
              {STATS.map((s) => (
                <div key={s.label}>
                  <strong>{s.number}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-collage" aria-hidden="true">
            <img className="collage-a" src={burger} alt="" />
            <img className="collage-b" src={lasagne} alt="" />
            <img className="collage-c" src={sticks} alt="" />
            <div className="collage-badge">
              <b>۱۰۰٪</b>
              <span>مواد تازه، هر روز</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;
