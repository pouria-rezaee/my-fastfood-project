import MenuItem from "../menuitem/MenuItem";
import "./MenuGrid.css";

// شبکه‌ی غذاها (در فروشگاه و علاقه‌مندی‌ها استفاده می‌شود)
function MenuGrid({
  items,
  emptyText = "هنوز آیتمی در این دسته ثبت نشده است.",
}) {
  return (
    <>
      <main className="menu">
        {items.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </main>
      {items.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
          {emptyText}
        </p>
      )}
    </>
  );
}

export default MenuGrid;
