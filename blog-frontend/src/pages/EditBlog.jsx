import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Send, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBlogById, updateBlog } from "../services/blogService";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await getBlogById(id);
        const blog = data.blog;
        setTitle(blog.title);
        setDescription(blog.description || "");
        setContent(blog.content);
        setStatus(blog.status || "published");
        if (blog.image) {
          setPreview(`${serverUrl}${blog.image}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, serverUrl]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      await updateBlog(id, formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading story for editing...</div>;
  }

  return (
    <main className="editor-page">
      <div className="editor-container">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="editor-header">
          <div>
            <span className="section-label">Edit Story</span>
            <h1>Update your story.</h1>
            <p>Make changes to your published or draft story.</p>
          </div>

          <button
            form="blog-form"
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            <Send size={17} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form id="blog-form" className="editor-form" onSubmit={handleSubmit}>
          <div className="editor-main">
            <input
              className="title-input"
              type="text"
              placeholder="Your story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              className="description-input"
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <textarea
              className="content-input"
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <aside className="editor-sidebar">
            <div className="editor-panel">
              <div className="panel-title">Cover image</div>

              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                  <button type="button" onClick={removeImage}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="upload-area">
                  <ImagePlus size={27} />
                  <strong>Change cover image</strong>
                  <span>PNG, JPG or WEBP · Max 5MB</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleImage}
                  />
                </label>
              )}
            </div>

            <div className="editor-panel">
              <div className="panel-title">Publishing</div>

              <label className="select-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default EditBlog;
