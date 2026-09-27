import {
  createBlog,
  getBlogsByRepository,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../services/blog.service.js";

import {
  createBlogSchema,
  updateBlogSchema
} from "../validators/blog.validator.js";

export const create = async (req, res) => {
  try {
    const body = createBlogSchema.parse(req.body);

    const blog = await createBlog({
      repositoryId: req.params.repositoryId,
      authorId: req.user.id,
      ...body
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const blogs = await getBlogsByRepository(
      req.params.repositoryId
    );

    return res.status(200).json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const blog = await getBlogById(
      req.params.repositoryId,
      req.params.blogId
    );

    return res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error("Get blog error:", error);

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const update = async (req, res) => {
  try {
    const updates = updateBlogSchema.parse(
      req.body
    );

    const blog = await updateBlog({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId,
      updates
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteBlog({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};