import "./AboutTeam.css";

const TEAM = [
  { avatar: "👨‍🍳", name: "شهاب احمدی", role: "سرآشپز اصلی" },
  { avatar: "👩‍🍳", name: "سارا محمدی", role: "مدیر کیفیت" },
  { avatar: "👨‍💼", name: "رضا کریمی", role: "مدیر خدمات" },
];

function AboutTeam() {
  return (
    <section className="about-team">
      <div className="container">
        <h2>تیم ما</h2>
        <div className="team-grid">
          {TEAM.map((m) => (
            <div key={m.name} className="team-member">
              <div className="member-avatar">{m.avatar}</div>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutTeam;
