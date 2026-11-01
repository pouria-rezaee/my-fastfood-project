import { Link } from "react-router-dom";
import MenuGrid from "../../components/menugrid/MenuGrid";
import ProfileCard from "./ProfileCard";
import { useMenu } from "../../data/menuStore";
import { useFavorites } from "../../data/favoritesStore";

function FavoritesTab({ username }) {
  const menu = useMenu();
  const favIds = useFavorites(username);
  const items = menu.filter((m) => favIds.includes(m.id));

  if (items.length === 0) {
    return (
      <ProfileCard>
        <p className="profile-empty-orders">
          هنوز غذایی را به علاقه‌مندی‌ها اضافه نکرده‌اید. روی ❤ کنار هر غذا در{" "}
          <Link to="/shop">منو</Link> بزنید.
        </p>
      </ProfileCard>
    );
  }

  return <MenuGrid items={items} />;
}

export default FavoritesTab;
