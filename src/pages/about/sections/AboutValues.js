import "./AboutValues.css";

const VALUES = [
  {
    icon: "🥩",
    title: "کیفیت",
    text: "فقط از بهترین مواد اولیه استفاده می‌کنیم و هیچ‌وقت کیفیت رو فدا نمی‌کنیم.",
  },
  {
    icon: "🌿",
    title: "تازگی",
    text: "سبزی و گوشت هر روز صبح تهیه می‌شن؛ نه فریزر، نه نگه‌داری چند روزه.",
  },
  {
    icon: "⚡",
    title: "سرعت",
    text: "سفارش‌ها داغ و به‌موقع به دست شما می‌رسن؛ معمولاً زیر ۳۰ دقیقه.",
  },
  {
    icon: "💛",
    title: "رضایت",
    text: "رضایت شما معیار ماست و به هر نظر و پیشنهاد جدی گوش می‌دیم.",
  },
];

function AboutValues() {
  return (
    <section className="about-values">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">ارزش‌های ما</span>
          <h2>چهار قولی که به شما می‌دیم</h2>
        </div>

        <div className="values-grid">
          {VALUES.map((v, i) => (
            <article key={v.title} className="value-card">
              <span className="value-number">
                {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
              </span>
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutValues;
