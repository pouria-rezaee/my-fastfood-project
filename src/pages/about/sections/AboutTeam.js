import "./AboutTeam.css";

// اعضای تیم نمونه‌اند؛ اسم و سمت‌ها رو با واقعی عوض کن
const TEAM = [
  {
    name: "شهاب احمدی",
    role: "سرآشپز اصلی",
    bio: "بیش از ۱۲ سال تجربه در آشپزخانه‌های حرفه‌ای و خالق سس مخصوص ما.",
  },
  {
    name: "سارا محمدی",
    role: "مدیر کیفیت",
    bio: "مسئول کنترل تازگی مواد و رعایت استانداردهای بهداشتی.",
  },
  {
    name: "رضا کریمی",
    role: "مدیر خدمات مشتری",
    bio: "تضمین می‌کنه هر سفارش سریع و بدون دردسر به دست شما برسه.",
  },
];

function AboutTeam() {
  return (
    <section className="about-team">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">تیم ما</span>
          <h2>آدم‌هایی که پشت هر سفارش‌ان</h2>
        </div>

        <div className="team-grid">
          {TEAM.map((m) => (
            <article key={m.name} className="team-card">
              <div className="team-avatar">{m.name.charAt(0)}</div>
              <h3>{m.name}</h3>
              <span className="team-role">{m.role}</span>
              <p>{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutTeam;
