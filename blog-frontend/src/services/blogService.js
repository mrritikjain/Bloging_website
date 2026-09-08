import api from "./api";

export const getBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/id/${id}`);
  return response.data;
};

export const createBlog = async (formData) => {
  const response = await api.post("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const response = await api.put(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};
