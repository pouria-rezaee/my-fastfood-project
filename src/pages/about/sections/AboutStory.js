import "./AboutStory.css";

// محتوای نمونه؛ هر زمان خواستی می‌تونی سال‌ها و متن‌ها رو عوض کنی
const MILESTONES = [
  {
    year: "۱۳۹۵",
    title: "شروع ماجرا",
    text: "یه آشپزخونه‌ی کوچیک و یه آرزو: ساختن بهترین برگر شهر.",
  },
  {
    year: "۱۳۹۸",
    title: "منوی اختصاصی",
    text: "دستور پخت‌ها و سس‌های دست‌ساز خودمون رو ثبت کردیم.",
  },
  {
    year: "۱۴۰۱",
    title: "سفارش آنلاین",
    text: "تحویل سریع به سراسر شهر و پرداخت راحت از خونه.",
  },
  {
    year: "۱۴۰۵",
    title: "امروز",
    text: "بیش از ۵۰۰۰ مشتری راضی و منویی با ۵۰ محصول متنوع.",
  },
];

function AboutStory() {
  return (
    <section className="about-story">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">مسیر ما</span>
          <h2>از یه ایده‌ی ساده تا کافه‌ای که دوستش دارید</h2>
          <p>
            هر قدم رو با یه هدف برداشتیم: اینکه هر لقمه، طعمی قابل اعتماد داشته
            باشه.
          </p>
        </div>

        <ol className="timeline">
          {MILESTONES.map((m, i) => (
            <li key={m.year} className="timeline-item">
              <span className="timeline-dot">
                {(i + 1).toLocaleString("fa-IR")}
              </span>
              <div className="timeline-card">
                <b className="timeline-year">{m.year}</b>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default AboutStory;
