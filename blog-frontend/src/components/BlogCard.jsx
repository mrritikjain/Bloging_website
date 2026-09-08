import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const BlogCard = ({ blog }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const imageUrl = blog.image
    ? `${serverUrl}${blog.image}`
    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="blog-card">
      <Link to={`/blog/${blog.slug}`} className="blog-image-wrapper">
        <img src={imageUrl} alt={blog.title} className="blog-image" />
        <span className="blog-category">{blog.status || "Article"}</span>
      </Link>

      <div className="blog-card-content">
        <div className="blog-meta">
          <span>{blog.author?.name || "Author"}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h3>{blog.title}</h3>
        </Link>

        <p>{blog.description || (blog.content ? blog.content.substring(0, 100) + "..." : "")}</p>

        <Link to={`/blog/${blog.slug}`} className="read-more">
          Read article
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
