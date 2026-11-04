import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticles } from "../../data/blogStore";
import { imageFor } from "../../data/images";
import "./Blogdetail.css";
import LinkButton from "../../components/button/LinkButton";

/* ---------- تبدیل اعداد فارسی به لاتین در متن ---------- */
const toLatinDigits = (str) =>
  String(str || "").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

/* ---------- جدا کردن شماره از ابتدای عنوان ---------- */
function splitHeadingNumber(text) {
  // الگوهایی مثل "۱. ", "1. ", "1- ", "۱- "
  const match = String(text).match(/^\s*([0-9۰-۹]+)\s*[.\-–]\s*(.+)$/);
  if (match) {
    return {
      num: toLatinDigits(match[1]),
      title: match[2].trim(),
    };
  }
  return { num: null, title: text };
}

/* ---------- رندر بلاک‌های محتوا ---------- */
function renderBlock(block, idx) {
  switch (block.type) {
    case "p":
      return (
        <p key={idx} className="bd-p">
          {block.text}
        </p>
      );
    case "h3": {
      const { num, title } = splitHeadingNumber(block.text);
      return (
        <h3 key={idx} id={`heading-${idx}`} className="bd-h3">
          {num && <span className="bd-h3__num">{num}</span>}
          <span className="bd-h3__text">{title}</span>
        </h3>
      );
    }
    case "ul":
      return (
        <ul key={idx} className="bd-ul">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function BlogDetail() {
  const { id } = useParams();
  const articles = useArticles();
  const article = articles.find((a) => a.id === id);

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const contentRef = useRef(null);

  const toc = useMemo(() => {
    if (!article?.content) return [];
    return article.content
      .map((b, i) => {
        if (b.type !== "h3") return null;
        const { num, title } = splitHeadingNumber(b.text);
        return { id: `heading-${i}`, num, text: title };
      })
      .filter(Boolean);
  }, [article]);

  const coverSrc = article
    ? article.image || (article.imageKey ? imageFor(article) : null)
    : null;

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(total > 0 ? (scrolled / total) * 100 : 0);
      }
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [id]);

  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  const scrollTo = (hid) => {
    document
      .getElementById(hid)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!article) {
    return (
      <div className="blog-notfound">
        <div className="blog-notfound__emoji">🧭</div>
        <h2>مقاله پیدا نشد</h2>
        <p>شاید آدرس را اشتباه وارد کرده‌اید.</p>
        <LinkButton to="/blog" variant="primary">
          بازگشت به مقالات
        </LinkButton>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil((article.content?.length || 1) * 0.6));

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {/* هیرو */}
      <header className={`bd-hero ${!coverSrc ? "bd-hero--no-cover" : ""}`}>
        {coverSrc ? (
          <>
            <div
              className="bd-hero__bg"
              style={{ backgroundImage: `url(${coverSrc})` }}
            />
            <div className="bd-hero__overlay" />
          </>
        ) : (
          <div className="bd-hero__gradient" />
        )}

        <div className="bd-hero__content">
          {article.category && (
            <span className="bd-hero__cat">{article.category}</span>
          )}
          <h1 className="bd-hero__title">{article.title}</h1>
          <div className="bd-hero__meta">
            {article.date && <span>📅 {article.date}</span>}
            {article.author && <span>✍️ {article.author}</span>}
            <span className="bg-hero__meta_time">
              📖 {readTime} دقیقه مطالعه
            </span>
          </div>
        </div>
      </header>

      {/* بدنه اصلی — بدون پس‌زمینه سفارشی */}
      <div className="bd-main-wrapper">
        <div className="bd-layout" ref={contentRef}>
          {/* سایدبار سمت چپ */}
          <aside className="bd-sidebar">
            {toc.length > 0 && (
              <div className="toc-card">
                <div className="toc-card__title">
                  <span className="toc-card__dot" />
                  در این مقاله
                </div>
                <ul className="toc-list">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <button
                        className={`toc-link ${
                          activeId === t.id ? "is-active" : ""
                        }`}
                        onClick={() => scrollTo(t.id)}
                      >
                        <span className="toc-num">
                          {t.num || String(toc.indexOf(t) + 1).padStart(2, "0")}
                        </span>
                        <span className="toc-text">{t.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* محتوا */}
          <div className="blog-detail-content">
            {(article.content || []).map(renderBlock)}
          </div>
        </div>
      </div>

      <div className="bd-footer">
        <Link to="/blog" className="blog-detail-back-link">
          بازگشت به مقالات
        </Link>
      </div>

      <button
        className={`scroll-top ${showTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="بازگشت به بالا"
      >
        ↑
      </button>
    </>
  );
}
