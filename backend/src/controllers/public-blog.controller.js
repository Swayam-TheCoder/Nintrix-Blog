import {
  getPublishedBlogsByRepository,
  getPublishedBlogService
} from "../services/public-blog.service.js";

export const getPublishedBlogs = async (req, res) => {
  try {
    const result = await getPublishedBlogsByRepository(
      req.params.repositoryId
    );

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("Get public blogs error:", error);

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};


export const getPublishedBlog = async (req, res) => {
  try {
    const result = await getPublishedBlogService(
      req.params.repositoryId,
      req.params.blogId
    );

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Get public blog error:", error);

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};