import { useEffect, useState } from "react";
import { PenLine, Trash2, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBlogs, deleteBlog } from "../services/blogService";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await getBlogs();
        const myBlogs = (data.blogs || []).filter((blog) => blog.authorId === user?.id);
        setBlogs(myBlogs);
      } catch (error) {
        console.error("Error loading user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadBlogs();
    }
  }, [user]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this blog permanently?");
    if (!confirmed) return;

    try {
      await deleteBlog(id);
      setBlogs((previous) => previous.filter((blog) => blog.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <span className="section-label">Dashboard</span>
            <h1>Hello, {user?.name}.</h1>
            <p>Manage your stories and keep creating.</p>
          </div>

          <Link to="/create" className="primary-button">
            <PenLine size={17} />
            Write a story
          </Link>
        </div>

        <div className="dashboard-stats">
          <div>
            <span>Published stories</span>
            <strong>{blogs.length}</strong>
          </div>

          <div>
            <span>Your account</span>
            <strong>Writer</strong>
          </div>
        </div>

        <section className="dashboard-content">
          <div className="section-heading">
            <div>
              <span className="section-label">Your work</span>
              <h2>Your stories</h2>
            </div>
          </div>

          {loading ? (
            <div className="page-loader">Loading your stories...</div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <h3>Nothing here yet.</h3>
              <p>Your first story is waiting to be written.</p>
              <Link to="/create" className="primary-button">
                Create your first story
              </Link>
            </div>
          ) : (
            <div className="dashboard-list">
              {blogs.map((blog) => (
                <div className="dashboard-blog" key={blog.id}>
                  <div className="dashboard-blog-info">
                    <span>{blog.status}</span>
                    <h3>{blog.title}</h3>
                    <p>{blog.description || (blog.content ? blog.content.substring(0, 100) + "..." : "")}</p>
                  </div>

                  <div className="dashboard-actions">
                    <Link to={`/blog/${blog.slug}`} title="View Story">
                      <ExternalLink size={17} />
                    </Link>

                    <button onClick={() => navigate(`/edit/${blog.id}`)} title="Edit Story">
                      <PenLine size={17} />
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => handleDelete(blog.id)}
                      title="Delete Story"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
