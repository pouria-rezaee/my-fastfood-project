import "./MenuItem.css";
import Swal from "sweetalert2";
import { imageFor } from "../../data/images";
import { formatPrice } from "../../data/format";
import { addToCart } from "../../data/cartStore";
import { getCurrentUser } from "../../utils/auth";
import { useFavorites, toggleFavorite } from "../../data/favoritesStore";

function MenuItem({
  id,
  image,
  imageKey,
  name,
  description,
  price,
  available,
}) {
  const username = getCurrentUser();
  const favorites = useFavorites(username || "");
  const isFavorite = favorites.includes(id);
  const soldOut = available === false;

  const toast = (title) =>
    Swal.mixin({
      toast: true,
      position: "top-start",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    }).fire({ icon: "success", title });

  const favoriteHandler = () => {
    if (!username) {
      Swal.fire({
        icon: "info",
        title: "ابتدا وارد شوید",
        text: "برای ذخیره‌ی علاقه‌مندی‌ها باید وارد حساب خود شوید",
        confirmButtonColor: "#ff6900",
      });
      return;
    }
    toggleFavorite(username, id);
  };

  const addToCartHandler = () => {
    addToCart(id);
    toast(`${name} به سبد خرید اضافه شد`);
  };

  return (
    <div className="menu-item">
      <img src={imageFor({ image, imageKey })} alt={name} loading="lazy" />
      <div className="menu-item-details">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="tools">
          <span className="menu-item-price">{formatPrice(price)} تومان</span>
          <button
            type="button"
            className="menu-item-fav"
            onClick={favoriteHandler}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
            }
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
      <button
        className="menu-item-button"
        onClick={addToCartHandler}
        disabled={soldOut}
        style={soldOut ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
      >
        {soldOut ? "ناموجود" : "افزودن به سبد خرید"}
      </button>
    </div>
  );
}

export default MenuItem;
