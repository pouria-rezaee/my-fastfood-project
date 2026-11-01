import ContactHero from "./sections/ContactHero";
import ContactInfo from "./sections/ContactInfo";
import ContactForm from "./sections/ContactForm";
import ContactFaq from "./sections/ContactFaq";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <ContactHero />
      <section className="contact-main">
        <div className="container">
          <div className="contact-layout">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
      <ContactFaq />
    </div>
  );
}

export default Contact;
