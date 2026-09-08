import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedBlog = ({ blog }) => {
  if (!blog) return null;

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const imageUrl = blog.image
    ? `${serverUrl}${blog.image}`
    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="content-container">
      <div className="section-heading">
        <div>
          <span className="section-label">Featured</span>
          <h2>Editor's pick</h2>
        </div>

        <a href="#latest" className="view-all">
          View all
          <ArrowRight size={16} />
        </a>
      </div>

      <Link to={`/blog/${blog.slug}`} className="featured-blog">
        <div className="featured-image">
          <img src={imageUrl} alt={blog.title} />
        </div>

        <div className="featured-content">
          <div className="featured-number">01</div>

          <div className="blog-meta">
            <span>{blog.author?.name || "Author"}</span>
            <span>•</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h2>{blog.title}</h2>
          <p>{blog.description || (blog.content ? blog.content.substring(0, 140) + "..." : "")}</p>

          <span className="featured-read">
            Read full story
            <ArrowRight size={17} />
          </span>
        </div>
      </Link>
    </section>
  );
};

export default FeaturedBlog;
