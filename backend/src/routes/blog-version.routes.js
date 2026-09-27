import { Router } from "express";

import { getVersions } from "../controllers/blog-version.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  requireRepositoryAccess
} from "../middleware/repository.middleware.js";

const router = Router();

router.get(
  "/:repositoryId/blogs/:blogId/versions",
  requireAuth,
  requireRepositoryAccess,
  getVersions
);

export default router;