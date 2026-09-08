import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../services/blogService";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (blog.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const featuredBlog = filteredBlogs[0];
  const remainingBlogs = filteredBlogs.slice(1);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="hero-content">
          <div className="eyebrow">
            <Sparkles size={15} />
            Ideas worth sharing
          </div>

          <h1>
            Stories that
            <br />
            <span>move you.</span>
          </h1>

          <p>
            A modern space for ideas, experiences, technology and everything
            worth talking about.
          </p>

          <div className="hero-buttons">
            <a href="#latest" className="primary-button">
              Explore stories
              <ArrowRight size={18} />
            </a>

            <Link to="/create" className="secondary-button">
              Start writing
            </Link>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floating-card card-one">
            <span>01</span>
            Ideas
          </div>

          <div className="floating-card card-two">
            <span>02</span>
            Stories
          </div>

          <div className="floating-card card-three">
            <span>03</span>
            People
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="content-container">
        <div className="search-container">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* FEATURED */}
      {featuredBlog && (
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

          <Link to={`/blog/${featuredBlog.slug}`} className="featured-blog">
            <div className="featured-image">
              <img
                src={
                  featuredBlog.image
                    ? `${serverUrl}${featuredBlog.image}`
                    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
                }
                alt={featuredBlog.title}
              />
            </div>

            <div className="featured-content">
              <div className="featured-number">01</div>

              <div className="blog-meta">
                <span>{featuredBlog.author?.name || "Author"}</span>
                <span>•</span>
                <span>
                  {new Date(featuredBlog.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2>{featuredBlog.title}</h2>
              <p>{featuredBlog.description || (featuredBlog.content ? featuredBlog.content.substring(0, 140) + "..." : "")}</p>

              <span className="featured-read">
                Read full story
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* LATEST */}
      <section id="latest" className="content-container latest-section">
        <div className="section-heading">
          <div>
            <span className="section-label">Fresh from the press</span>
            <h2>Latest stories</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((item) => (
              <div className="skeleton-card" key={item} />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <h3>No stories found</h3>
            <p>Be the first one to publish a story on our platform.</p>
            <Link to="/create" className="primary-button">
              Write a story
            </Link>
          </div>
        ) : (
          <div className="blog-grid">
            {remainingBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
