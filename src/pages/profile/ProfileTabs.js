import "./ProfileTabs.css";

const TABS = [
  { key: "info", label: "اطلاعات من" },
  { key: "orders", label: "سفارش‌های من" },
  { key: "favorites", label: "علاقه‌مندی‌ها" },
];

function ProfileTabs({ tab, onChange }) {
  return (
    <div className="profile-tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`profile-tab ${tab === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
