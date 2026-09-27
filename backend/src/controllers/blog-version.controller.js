import { getBlogVersions } from "../services/blog-version.service.js";

export const getVersions = async (req, res) => {
  try {
    const versions = await getBlogVersions(
      req.params.repositoryId,
      req.params.blogId
    );

    return res.status(200).json({
      success: true,
      versions
    });
  } catch (error) {
    console.error(
      "Get blog versions error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};