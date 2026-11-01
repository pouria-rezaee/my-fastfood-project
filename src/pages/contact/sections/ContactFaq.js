import { useSettings } from "../../../data/settingsStore";
import { formatPrice } from "../../../data/format";
import "./ContactFaq.css";

function ContactFaq() {
  const settings = useSettings();

  const faqs = [
    {
      q: "ساعت کاری شما چطوره؟",
      a: `${settings.hours}. سفارش‌های آنلاین در همین ساعت‌ها پذیرفته می‌شن.`,
    },
    {
      q: "هزینه‌ی ارسال چقدره؟",
      a: `هزینه‌ی ارسال ${formatPrice(settings.deliveryFee)} تومانه و برای خریدهای بالای ${formatPrice(settings.freeDeliveryOver)} تومان رایگانه.`,
    },
    {
      q: "چطور می‌تونم پرداخت کنم؟",
      a: "می‌تونید آنلاین پرداخت کنید یا هنگام تحویل سفارش، پرداخت در محل رو انتخاب کنید.",
    },
    {
      q: "اگه سفارشم رو اشتباه ثبت کردم چی؟",
      a: "تا قبل از تأیید سفارش، از بخش «سفارش‌های من» توی پروفایل می‌تونید اون رو لغو کنید.",
    },
  ];

  return (
    <section className="contact-faq">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">سؤال‌های پرتکرار</span>
          <h2>شاید جوابت همین‌جا باشه</h2>
        </div>

        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactFaq;
