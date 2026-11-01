import { useSettings } from "../../../data/settingsStore";
import "./ContactInfo.css";

function ContactInfo() {
  const settings = useSettings();

  return (
    <div className="contact-info">
      <h2>اطلاعات تماس</h2>

      <div className="info-item">
        <h3>آدرس</h3>
        <p>{settings.address}</p>
      </div>

      <div className="info-item">
        <h3>تلفن</h3>
        <p>{settings.phone}</p>
        <p>{settings.mobile}</p>
      </div>

      <div className="info-item">
        <h3>ایمیل</h3>
        <p>{settings.email}</p>
        <p>{settings.supportEmail}</p>
      </div>

      <div className="info-item">
        <h3>ساعات کاری</h3>
        <p>{settings.hours}</p>
      </div>
    </div>
  );
}

export default ContactInfo;
