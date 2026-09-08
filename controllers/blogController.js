const slugify = require("slugify");
const prisma = require("../config/db");

// Create blog
const createBlog = async (req, res) => {
  try {
    const { title, description, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    let baseSlug = slugify(title, { lower: true, strict: true }) || `blog-${Date.now()}`;
    let slug = baseSlug;

    // Ensure unique slug
    const existingSlug = await prisma.blog.findUnique({
      where: { slug }
    });

    if (existingSlug) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const blogStatus = status || "published";

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        description: description || "",
        content,
        image,
        status: blogStatus,
        published: blogStatus === "published",
        authorId: Number(req.user.id)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      blogs
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.json({
      blog
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get single blog by ID
const getBlogById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.json({
      blog
    });
  } catch (error) {
    console.error("Get blog by ID error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.authorId !== Number(req.user.id)) {
      return res.status(403).json({
        message: "Not authorized to edit this blog"
      });
    }

    const { title, description, content, status } = req.body;
    const updateData = {};

    if (title) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (content) {
      updateData.content = content;
    }
    if (status) {
      updateData.status = status;
      updateData.published = status === "published";
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Authorization check
    if (blog.authorId !== Number(req.user.id)) {
      return res.status(403).json({
        message: "Not authorized to delete this blog"
      });
    }

    await prisma.blog.delete({
      where: { id }
    });

    res.json({
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog
};
