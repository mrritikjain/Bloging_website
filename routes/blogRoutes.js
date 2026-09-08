const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create blog
router.post("/", protect, upload.single("image"), createBlog);

// Get all blogs
router.get("/", getBlogs);

// Get single blog by ID
router.get("/id/:id", getBlogById);

// Get single blog by slug
router.get("/:slug", getBlogBySlug);

// Update blog
router.put("/:id", protect, upload.single("image"), updateBlog);

// Delete blog
router.delete("/:id", protect, deleteBlog);

module.exports = router;
