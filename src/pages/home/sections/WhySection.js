import Section from "../../../components/section/Section";
import Fooditem from "../../../components/fooditem/Fooditem";
import { useSettings } from "../../../data/settingsStore";
import "./WhySection.css";

function WhySection() {
  const settings = useSettings();

  return (
    <Section title={`چرا ${settings.name} را انتخاب کنید؟`}>
      <div className="products-grid">
        <Fooditem />
      </div>
    </Section>
  );
}

export default WhySection;
