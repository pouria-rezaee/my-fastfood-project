import { breadcrumbOf, childrenOf, presetScopes } from "../../../utils/periods";
import { formatPrice } from "../../../data/format";
import { fa } from "../../../utils/jalali";
import "./PeriodNav.css";

const sameScope = (a, b) => ["y", "m", "w", "d"].every((k) => a[k] === b[k]);

// ناوبری زمانی: میانبرها + مسیر + «پوشه‌های» سطح بعدی (سال ← ماه ← هفته ← روز)
function PeriodNav({ items, scope, onChange }) {
  const crumbs = breadcrumbOf(scope);
  const { level, title, cells } = childrenOf(items, scope);
  const maxRevenue = Math.max(1, ...cells.map((c) => c.revenue));
  const presets = presetScopes();

  return (
    <div className="pn">
      <div className="pn-top">
        <div className="pn-presets">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`pn-preset ${sameScope(p.scope, scope) ? "active" : ""}`}
              onClick={() => onChange(p.scope)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <nav className="pn-crumbs" aria-label="مسیر">
          {crumbs.map((c, i) => (
            <span key={c.label + i} className="pn-crumb-wrap">
              {i > 0 && <span className="pn-sep">‹</span>}
              <button
                type="button"
                className={`pn-crumb ${i === crumbs.length - 1 ? "current" : ""}`}
                onClick={() => onChange(c.patch)}
                disabled={i === crumbs.length - 1}
              >
                {c.label}
              </button>
            </span>
          ))}
        </nav>
      </div>

      {level !== "none" && (
        <>
          <h3 className="pn-title">{title}</h3>
          <div className={`pn-grid pn-${level}`}>
            {cells.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`pn-folder ${c.empty ? "is-empty" : ""}`}
                disabled={c.empty}
                onClick={() => onChange(c.patch)}
              >
                <span className="pn-folder-tab" />
                <span className="pn-folder-head">
                  <b>{c.label}</b>
                  <small>{c.sub}</small>
                </span>
                <span className="pn-folder-count">
                  {c.empty ? "بدون سفارش" : `${fa(c.count)} سفارش`}
                </span>
                {!c.empty && (
                  <>
                    <span className="pn-folder-revenue">
                      {formatPrice(c.revenue)} تومان
                    </span>
                    <span className="pn-bar">
                      <i
                        style={{
                          width: `${Math.max(4, (c.revenue / maxRevenue) * 100)}%`,
                        }}
                      />
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PeriodNav;
