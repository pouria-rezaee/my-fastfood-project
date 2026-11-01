import LinkButton from "../../../components/button/LinkButton";
import Section from "../../../components/section/Section";
import MenuItem from "../../../components/menuitem/MenuItem";
import { useMenu } from "../../../data/menuStore";
import "./PopularSection.css";

function PopularSection() {
  const menu = useMenu();
  const popularItems = menu
    .filter((item) => item.available !== false)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);

  return (
    <Section title="محصولات محبوب" subtitle="برترین انتخاب‌های مشتریان ما">
      <div className="popular-products-grid">
        {popularItems.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
      <div className="section-cta">
        <LinkButton to="/shop" variant="outline" icon>
          مشاهده همه محصولات
        </LinkButton>
      </div>
    </Section>
  );
}

export default PopularSection;
