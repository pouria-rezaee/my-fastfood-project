import ContactHero from "./sections/ContactHero";
import ContactInfo from "./sections/ContactInfo";
import ContactForm from "./sections/ContactForm";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <ContactHero />
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
