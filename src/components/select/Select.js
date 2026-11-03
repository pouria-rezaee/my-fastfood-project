import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Select.css";

// منوی کشویی سفارشی (جایگزین <select> پیش‌فرض مرورگر)
// options: [{ value, label }]   |   با کیبورد هم کار می‌کند: ↑ ↓ Home End Enter Esc
function Select({
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  size = "md",
  className = "",
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const place = () => {
    const r = btnRef.current.getBoundingClientRect();
    const wanted = Math.min(280, options.length * 42 + 12);
    const below = window.innerHeight - r.bottom - 12;
    const up = below < wanted && r.top > below;
    setPos({
      left: r.left,
      width: r.width,
      top: up ? undefined : r.bottom + 6,
      bottom: up ? window.innerHeight - r.top + 6 : undefined,
      maxHeight: Math.max(120, Math.min(280, (up ? r.top : below) - 8)),
    });
  };

  const openList = () => {
    if (disabled || options.length === 0) return;
    place();
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const choose = (option) => {
    if (!option) return;
    if (option.value !== value) onChange(option.value);
    close();
    btnRef.current?.focus();
  };

  // بستن با کلیک بیرون، اسکرول صفحه یا تغییر اندازه
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        listRef.current?.contains(e.target)
      )
        return;
      close();
    };
    const onScroll = (e) => {
      if (listRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // گزینه‌ی فعال همیشه توی دید بماند
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    const last = options.length - 1;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(options[active]);
        break;
      case "Tab":
        close();
        break;
      default:
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`cs-select cs-${size} ${open ? "is-open" : ""} ${className}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
      >
        <span className={`cs-value ${selected ? "" : "is-placeholder"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="cs-chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M5 7.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="cs-list"
            style={{
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
            }}
          >
            {options.map((o, i) => (
              <li
                key={String(o.value)}
                role="option"
                aria-selected={o.value === value}
                data-active={i === active}
                className={`cs-option ${o.value === value ? "is-selected" : ""} ${i === active ? "is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
              >
                <span>{o.label}</span>
                {o.value === value && (
                  <svg
                    className="cs-check"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 10.5l3.5 3.5 7.5-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </>
  );
}

export default Select;
