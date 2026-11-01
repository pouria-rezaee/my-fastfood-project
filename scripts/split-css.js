/*
  تقسیم فایل‌های CSS بزرگ به فایل‌های کوچک (یک CSS برای هر کامپوننت)
  اجرا:   node scripts/split-css.js            (فقط گزارش، چیزی نمی‌نویسد)
          node scripts/split-css.js --write    (اعمال تغییرات + بکاپ در پوشه css-backup)
  قبل از نوشتن، اسکریپت بررسی می‌کند هیچ قانون CSS گم یا تغییر نکرده باشد.
*/
const fs = require("fs");
const path = require("path");

const WRITE = process.argv.includes("--write");
const ROOT = process.cwd();

// ------------------------- تنظیمات: هر قانون به کدام فایل برود -------------------------
const jobs = [
  {
    source: "src/components/navbar/Navbar.css",
    rest: "src/components/navbar/Navbar.css",
    rules: [
      { to: "src/styles/global.css", test: /^:root$/ },
      { to: "src/components/navbar/MobileMenu.css", test: /^\.mobile-/ },
      {
        to: "src/components/navbar/UserMenu.css",
        test: /^\.(user-menu|username-label)/,
      },
    ],
  },
  {
    source: "src/pages/home/Home.css",
    rest: "src/pages/home/Home.css",
    rules: [
      {
        to: "src/styles/global.css",
        test: /^(:root|\*|body|html|h[1-6]|p|\.container|\.highlight|\.btn.*|@keyframes (fadeIn|fadeInUp))$/,
      },
      {
        to: "src/components/section/Section.css",
        test: /^\.(products-section|section-header|section-title|section-subtitle)/,
      },
      {
        to: "src/pages/home/sections/HeroFeatures.css",
        test: /^\.(hero-features|feature)/,
      },
      {
        to: "src/pages/home/sections/HeroImage.css",
        test: /^(\.(hero-image|image-container|price-tag)|@keyframes float$)/,
      },
      { to: "src/pages/home/sections/HeroSection.css", test: /^\.hero-/ },
      {
        to: "src/pages/home/sections/PopularSection.css",
        test: /^\.(popular-products-grid|section-cta)/,
      },
      {
        to: "src/pages/home/sections/WhySection.css",
        test: /^\.products-grid/,
      },
      {
        to: "src/pages/home/sections/AboutSection.css",
        test: /^\.(about-|stats|stat-)/,
      },
    ],
  },
  {
    source: "src/components/footer/Footer.css",
    rest: "src/components/footer/Footer.css",
    rules: [
      {
        to: "src/components/footer/FooterNewsletter.css",
        test: /^\.newsletter-/,
      },
    ],
  },
  {
    source: "src/pages/about/About.css",
    rest: "src/pages/about/About.css",
    rules: [
      { to: "src/pages/about/sections/AboutHero.css", test: /^\.about-hero/ },
      {
        to: "src/pages/about/sections/AboutStory.css",
        test: /^\.(about-story|story-)/,
      },
      {
        to: "src/pages/about/sections/AboutValues.css",
        test: /^\.(about-values|values-grid|value-item)/,
      },
      {
        to: "src/pages/about/sections/AboutTeam.css",
        test: /^\.(about-team|team-|member-)/,
      },
    ],
  },
  {
    source: "src/pages/contact/Contact.css",
    rest: "src/pages/contact/Contact.css",
    rules: [
      {
        to: "src/pages/contact/sections/ContactHero.css",
        test: /^\.contact-hero/,
      },
      {
        to: "src/pages/contact/sections/ContactInfo.css",
        test: /^\.(contact-info|info-item)/,
      },
      {
        to: "src/pages/contact/sections/ContactForm.css",
        test: /^\.(contact-form|form|form-group|submit-btn)/,
      },
    ],
  },
  {
    source: "src/pages/profile/Profile.css",
    rest: "src/pages/profile/Profile.css",
    rules: [
      {
        to: "src/pages/profile/OrdersTab.css",
        test: /^\.(orders-list|order-)/,
      },
      {
        to: "src/pages/profile/ProfileHeader.css",
        test: /^\.(profile-header|profile-avatar|profile-username|profile-logout-btn)/,
      },
      { to: "src/pages/profile/ProfileTabs.css", test: /^\.profile-tab/ },
      {
        to: "src/pages/profile/ProfileForm.css",
        test: /^\.(profile-form-group|profile-save-btn)/,
      },
      {
        to: "src/pages/profile/ProfileCard.css",
        test: /^\.(profile-grid|profile-card|profile-orders-card|profile-empty-orders)/,
      },
    ],
  },
  {
    source: "src/pages/shop/Shop.css",
    rest: "src/pages/shop/Shop.css",
    rules: [
      {
        to: "src/components/categorybar/CategoryBar.css",
        test: /^\.category-/,
      },
      { to: "src/components/menugrid/MenuGrid.css", test: /^\.menu$/ },
      { to: "src/components/menuitem/MenuItem.css", test: /^\.menu-item/ },
    ],
  },
  {
    source: "src/pages/blog/Blog.css",
    rest: "src/pages/blog/Blog.css",
    rules: [
      { to: "src/pages/blog/BlogCard.css", test: /^\.(blog-card|read-more)/ },
    ],
  },
  {
    source: "src/pages/admin/Admin.css",
    rest: "src/pages/admin/Admin.css",
    rules: [
      {
        to: "src/pages/admin/sections/OrdersSection.css",
        test: /^\.adm-(order|items|history|status-row)/,
      },
      {
        to: "src/pages/admin/sections/MessagesSection.css",
        test: /^\.adm-msg/,
      },
      {
        to: "src/pages/admin/sections/DashboardSection.css",
        test: /^\.adm-(stats?|two-col|chart|bar(-wrap)?|top)(?![\w-])/,
      },
      {
        to: "src/pages/admin/AdminUi.css",
        test: /^(\.adm-(card|empty|hint|sub|toolbar|narrow|input|btn|actions|chips|chip|table|thumb|tag|grid-2|field|check|upload|overlay|modal)|\.tag-)/,
      },
    ],
  },
];

// ------------------------- تجزیه‌ی ساده‌ی CSS -------------------------
function parse(css) {
  const nodes = [];
  let i = 0;
  let lead = "";
  const n = css.length;
  while (i < n) {
    // فاصله‌ها
    if (/\s/.test(css[i])) {
      i++;
      continue;
    }
    // کامنت
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      lead += css.slice(i, stop) + "\n";
      i = stop;
      continue;
    }
    // prelude تا { یا ;
    let j = i,
      paren = 0,
      quote = null;
    while (j < n) {
      const c = css[j];
      if (quote) {
        if (c === quote && css[j - 1] !== "\\") quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === "(") paren++;
      else if (c === ")") paren--;
      else if (css.startsWith("/*", j)) {
        const e = css.indexOf("*/", j + 2);
        j = e === -1 ? n : e + 1;
      } else if (paren === 0 && (c === "{" || c === ";")) break;
      j++;
    }
    const prelude = css.slice(i, j).trim();
    if (css[j] === ";" || j >= n) {
      nodes.push({ lead, prelude, body: null });
      lead = "";
      i = j + 1;
      continue;
    }
    // بدنه با شمارش آکولاد
    let depth = 1,
      k = j + 1;
    quote = null;
    while (k < n && depth > 0) {
      const c = css[k];
      if (quote) {
        if (c === quote && css[k - 1] !== "\\") quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (css.startsWith("/*", k)) {
        const e = css.indexOf("*/", k + 2);
        k = e === -1 ? n : e + 1;
      } else if (c === "{") depth++;
      else if (c === "}") depth--;
      k++;
    }
    const body = css.slice(j + 1, k - 1);
    const node = { lead, prelude, body };
    if (/^@(media|supports)/.test(prelude)) node.children = parse(body);
    nodes.push(node);
    lead = "";
    i = k;
  }
  if (lead.trim())
    nodes.push({ lead, prelude: "", body: null, onlyComment: true });
  return nodes;
}

function splitSelectors(prelude) {
  const out = [];
  let cur = "",
    paren = 0;
  for (const c of prelude) {
    if (c === "(" || c === "[") paren++;
    if (c === ")" || c === "]") paren--;
    if (c === "," && paren === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const norm = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();

// همه‌ی «قانون‌های برگ» برای بررسی نهایی: context | selector | body
function leaves(nodes, ctx = "") {
  const res = [];
  for (const nd of nodes) {
    if (nd.onlyComment) continue;
    if (nd.children) res.push(...leaves(nd.children, ctx + nd.prelude + " > "));
    else if (nd.body === null) res.push(`${ctx}${norm(nd.prelude)}`);
    else if (nd.prelude.startsWith("@"))
      res.push(`${ctx}${norm(nd.prelude)} {${norm(nd.body)}}`);
    else
      splitSelectors(nd.prelude).forEach((s) =>
        res.push(`${ctx}${norm(s)} {${norm(nd.body)}}`),
      );
  }
  return res;
}

// ------------------------- توزیع قانون‌ها -------------------------
function targetOf(job, selector) {
  for (const r of job.rules) if (r.test.test(selector)) return r.to;
  return job.rest;
}

function emit(job, nodes, out) {
  // out: Map target -> array of text chunks
  for (const nd of nodes) {
    if (nd.onlyComment) {
      push(out, job.rest, nd.lead);
      continue;
    }
    if (nd.children) {
      const sub = new Map();
      emit(job, nd.children, sub);
      let first = true;
      for (const [target, chunks] of sub) {
        push(
          out,
          target,
          (first ? nd.lead : "") +
            nd.prelude +
            " {\n" +
            chunks.join("\n\n").replace(/^/gm, "  ") +
            "\n}",
        );
        first = false;
      }
      if (sub.size === 0) push(out, job.rest, nd.lead);
      continue;
    }
    if (nd.body === null || nd.prelude.startsWith("@")) {
      push(
        out,
        targetOf(job, nd.prelude),
        nd.lead + nd.prelude + (nd.body === null ? ";" : " {" + nd.body + "}"),
      );
      continue;
    }
    const groups = new Map();
    splitSelectors(nd.prelude).forEach((s) => {
      const t = targetOf(job, s);
      if (!groups.has(t)) groups.set(t, []);
      groups.get(t).push(s);
    });
    let first = true;
    for (const [t, sels] of groups) {
      push(
        out,
        t,
        (first ? nd.lead : "") + sels.join(",\n") + " {" + nd.body + "}",
      );
      first = false;
    }
  }
}

function push(map, key, text) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(text.trim());
}

// ------------------------- اجرا -------------------------
const result = new Map(); // file -> chunks
let failed = false;

for (const job of jobs) {
  const srcPath = path.join(ROOT, job.source);
  if (!fs.existsSync(srcPath)) {
    console.log(`✗ فایل پیدا نشد: ${job.source}`);
    failed = true;
    continue;
  }
  const css = fs.readFileSync(srcPath, "utf8").replace(/\r\n/g, "\n");
  const nodes = parse(css);
  const before = leaves(nodes).sort();

  const out = new Map();
  emit(job, nodes, out);

  // بررسی: خروجی دوباره parse و با ورودی مقایسه می‌شود
  const after = [];
  for (const chunks of out.values())
    after.push(...leaves(parse(chunks.join("\n\n"))));
  after.sort();
  const same =
    before.length === after.length && before.every((v, i) => v === after[i]);
  console.log(
    `${same ? "✓" : "✗"} ${job.source}: ${before.length} قانون → ${[...out.entries()].map(([f, c]) => path.basename(f) + "(" + c.length + ")").join("، ")}`,
  );
  if (!same) {
    failed = true;
    continue;
  }

  for (const [target, chunks] of out) {
    if (!result.has(target)) result.set(target, []);
    result.get(target).push(...chunks);
  }
}

if (failed) {
  console.log("\nخطا: چیزی نوشته نشد.");
  process.exit(1);
}
if (!WRITE) {
  console.log(
    "\nهمه‌چیز درست است. برای اعمال تغییرات: node scripts/split-css.js --write",
  );
  process.exit(0);
}

// بکاپ و نوشتن
const backupDir = path.join(ROOT, "css-backup");
for (const job of jobs) {
  const dest = path.join(backupDir, job.source);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(ROOT, job.source), dest);
}
const targets = new Set(result.keys());
const sources = new Set(jobs.map((j) => j.source));
for (const [file, chunks] of result) {
  const full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  // اگر فایل مقصد از قبل وجود دارد (مثل MenuItem.css) محتوای قبلی حفظ و قانون‌های جدید بعد از آن اضافه می‌شود
  let existing = "";
  if (fs.existsSync(full) && !sources.has(file)) {
    existing =
      fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n").trim() + "\n\n";
  }
  fs.writeFileSync(full, existing + chunks.join("\n\n") + "\n", "utf8");
}
for (const job of jobs)
  if (!targets.has(job.source)) fs.unlinkSync(path.join(ROOT, job.source));
console.log(
  `\nانجام شد. ${result.size} فایل نوشته شد. بکاپ فایل‌های اصلی: css-backup/`,
);
