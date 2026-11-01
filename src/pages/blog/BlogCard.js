import { NavLink } from "react-router-dom";
import { imageFor } from "../../data/images";
import "./BlogCard.css";

function BlogCard({ article }) {
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={imageFor(article)} alt={article.title} />
      </div>
      <div className="blog-card-content">
        <h2>{article.title}</h2>
        <p>{article.summary}</p>
        <NavLink to={`/blog/${article.id}`} className="read-more">
          ادامه مطلب
        </NavLink>
      </div>
    </div>
  );
}

export default BlogCard;
