import {
  createBlog,
  getBlogsByRepository,
  getBlogById,
  updateBlog,
  deleteBlog,
  archiveBlog,
  changeBlogStatus,
} from "../services/blog.service.js";

import {
  createBlogSchema,
  publishBlogSchema,
  updateBlogSchema,
} from "../validators/blog.validator.js";

export const create = async (req, res) => {
  try {
    const body = createBlogSchema.parse(req.body);

    const blog = await createBlog({
      repositoryId: req.params.repositoryId,
      authorId: req.user.id,
      ...body,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const blogs = await getBlogsByRepository(req.params.repositoryId);

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const blog = await getBlogById(req.params.repositoryId, req.params.blogId);

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const updates = updateBlogSchema.parse(req.body);

    const blog = await updateBlog({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId,
      userId: req.user.id,
      updates,
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteBlog({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId,
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status } =
      publishBlogSchema.parse(req.body);

    const blog = await changeBlogStatus({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId,
      status
    });

    return res.status(200).json({
      success: true,
      message:
        status === "PUBLISHED"
          ? "Blog published successfully"
          : "Blog moved to draft",
      blog
    });
  } catch (error) {
    console.error(
      "Change blog status error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const archive = async (req, res) => {
  try {
    const blog = await archiveBlog({
      repositoryId: req.params.repositoryId,
      blogId: req.params.blogId
    });

    return res.status(200).json({
      success: true,
      message: "Blog archived successfully",
      blog
    });
  } catch (error) {
    console.error(
      "Archive blog error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};