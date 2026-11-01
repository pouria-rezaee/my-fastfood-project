import "./AboutValues.css";

const VALUES = [
  { title: "کیفیت", text: "استفاده از بهترین مواد اولیه" },
  { title: "تازگی", text: "مواد اولیه تازه روز" },
  { title: "سرعت", text: "تحویل سریع و دقیق" },
  { title: "رضایت", text: "رضایت مشتری اولویت ماست" },
];

function AboutValues() {
  return (
    <section className="about-values">
      <div className="container">
        <h2>ارزش‌های ما</h2>
        <div className="values-grid">
          {VALUES.map((v) => (
            <div key={v.title} className="value-item">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutValues;
