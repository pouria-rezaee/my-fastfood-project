import "./Section.css";

// بخش استاندارد صفحه با عنوان و زیرعنوان
function Section({ title, subtitle, children }) {
  return (
    <section className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default Section;
