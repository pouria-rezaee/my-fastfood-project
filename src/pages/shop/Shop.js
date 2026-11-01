import "./Shop.css";
import { useState, useMemo } from "react";
import CategoryBar from "../../components/categorybar/CategoryBar";
import MenuGrid from "../../components/menugrid/MenuGrid";
import { useMenu, CATEGORIES } from "../../data/menuStore";
import allicon from "../../assets/images/icons/icons8-all-48.png";
import cheseburger from "../../assets/images/icons/icons8-cheese-burger-64.png";
import chicken from "../../assets/images/icons/icons8-chicken-50.png";
import grilled from "../../assets/images/icons/icons8-poultry-leg-48.png";
import drinks from "../../assets/images/icons/icons8-drink-48.png";
import salad from "../../assets/images/icons/icons8-salad-64.png";
import pizza from "../../assets/images/icons/icons8-pizza-48.png";
import potato from "../../assets/images/icons/icons8-potato-50.png";
import pasta from "../../assets/images/icons/icons8-pasta-64.png";

const ICONS = {
  burger: cheseburger,
  pizza,
  fried: grilled,
  pasta,
  chicken,
  potato,
  salad,
  drink: drinks,
};

const CATEGORY_LIST = [
  { key: "", label: "همه", icon: allicon },
  ...CATEGORIES.map((c) => ({ ...c, icon: ICONS[c.key] || allicon })),
];

function Shop() {
  const menu = useMenu();
  const [category, setCategory] = useState("");

  const items = useMemo(
    () => menu.filter((item) => !category || item.category === category),
    [menu, category],
  );

  return (
    <div className="shop-page">
      <CategoryBar
        categories={CATEGORY_LIST}
        active={category}
        onChange={setCategory}
      />
      <MenuGrid items={items} />
    </div>
  );
}

export default Shop;
