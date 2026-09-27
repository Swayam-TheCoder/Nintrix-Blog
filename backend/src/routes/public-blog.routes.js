import express from "express";

import {
  getPublishedBlogs,
  getPublishedBlog
} from "../controllers/public-blog.controller.js";

const router = express.Router();

router.get(
  "/repositories/:repositoryId/blogs",
  getPublishedBlogs
);

router.get(
  "/repositories/:repositoryId/blogs/:blogId",
  getPublishedBlog
);

export default router;