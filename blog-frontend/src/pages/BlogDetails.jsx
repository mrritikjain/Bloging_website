import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getBlogBySlug } from "../services/blogService";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data.blog);
      } catch (err) {
        setError(err.response?.data?.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return <div className="page-loader">Loading story...</div>;
  }

  if (error || !blog) {
    return (
      <main className="article-page">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>{error || "Story not found"}</h2>
          <p style={{ color: "#777", margin: "20px 0" }}>The story you are looking for might have been removed or renamed.</p>
          <Link to="/" className="primary-button">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = blog.image
    ? `${serverUrl}${blog.image}`
    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="article-page">
      <article>
        <div className="article-top">
          <Link to="/" className="back-link">
            <ArrowLeft size={17} />
            Back to stories
          </Link>

          <span className="article-status">{blog.status || "Published"}</span>
        </div>

        <header className="article-header">
          <h1>{blog.title}</h1>

          {blog.description && (
            <p className="article-description">{blog.description}</p>
          )}

          <div className="article-meta">
            <div>
              <User size={16} />
              <span>{blog.author?.name || "Author"}</span>
            </div>

            <div>
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {imageUrl && (
          <div className="article-image">
            <img src={imageUrl} alt={blog.title} />
          </div>
        )}

        <div className="article-content">
          {blog.content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : null
          )}
        </div>
      </article>
    </main>
  );
};

export default BlogDetails;
