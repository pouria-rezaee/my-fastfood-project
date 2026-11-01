import BlogCard from "./BlogCard";
import { useArticles } from "../../data/blogStore";
import "./Blog.css";

function Blog() {
  const articles = useArticles().filter((a) => a.published !== false);

  return (
    <div className="blog-container">
      <h1 className="blog-title">📚 مقالات خوشمزه ما</h1>

      <div className="blog-grid">
        {articles.map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>
          هنوز مقاله‌ای منتشر نشده است.
        </p>
      )}
    </div>
  );
}

export default Blog;
