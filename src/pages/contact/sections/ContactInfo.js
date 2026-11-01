import { useSettings } from "../../../data/settingsStore";
import "./ContactInfo.css";

function ContactInfo() {
  const settings = useSettings();

  const items = [
    { icon: "📍", label: "آدرس", lines: [settings.address] },
    { icon: "📞", label: "تلفن", lines: [settings.phone, settings.mobile] },
    {
      icon: "✉️",
      label: "ایمیل",
      lines: [settings.email, settings.supportEmail],
    },
    { icon: "🕒", label: "ساعات کاری", lines: [settings.hours] },
  ];

  return (
    <div className="contact-cards">
      {items.map((item) => (
        <div key={item.label} className="contact-card">
          <div className="contact-card-icon">{item.icon}</div>
          <div>
            <span className="contact-card-label">{item.label}</span>
            {item.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactInfo;
