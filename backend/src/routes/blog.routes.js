import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove
} from "../controllers/blog.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  requireRepositoryAccess,
  requireRepositoryRole
} from "../middleware/repository.middleware.js";

const router = Router();

router.post(
  "/:repositoryId/blogs",
  requireAuth,
  requireRepositoryAccess,
  requireRepositoryRole("OWNER", "EDITOR"),
  create
);

router.get(
  "/:repositoryId/blogs",
  requireAuth,
  requireRepositoryAccess,
  getAll
);

router.get(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryAccess,
  getOne
);

router.patch(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryAccess,
  requireRepositoryRole("OWNER", "EDITOR"),
  update
);

router.delete(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryAccess,
  requireRepositoryRole("OWNER"),
  remove
);

export default router;