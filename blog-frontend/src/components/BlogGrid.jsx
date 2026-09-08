import BlogCard from "./BlogCard";
import LoadingCard from "./LoadingCard";

const BlogGrid = ({ blogs = [], loading = false }) => {
  if (loading) {
    return (
      <div className="loading-grid">
        {[1, 2, 3].map((item) => (
          <LoadingCard key={item} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No stories found</h3>
        <p>No published stories match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;
