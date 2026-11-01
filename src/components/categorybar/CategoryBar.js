import "./CategoryBar.css";

function CategoryBar({ categories, active, onChange }) {
  return (
    <div className="category-bar">
      {categories.map((c) => (
        <button
          key={c.key}
          className={`category-chip ${active === c.key ? "active" : ""}`}
          onClick={() => onChange(c.key)}
        >
          <img src={c.icon} alt={c.label} className="category-chip-icon" />
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
