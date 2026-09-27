import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  archive,
  changeStatus
} from "../controllers/blog.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  requireRepositoryMember,
  requireRepositoryRole
} from "../middleware/repository.middleware.js";

const router = Router();

router.post(
  "/:repositoryId/blogs",
  requireAuth,
  requireRepositoryMember,
  requireRepositoryRole("OWNER", "EDITOR"),
  create
);

router.get(
  "/:repositoryId/blogs",
  requireAuth,
  requireRepositoryMember,
  getAll
);

router.get(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryMember,
  getOne
);

router.patch(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryMember,
  requireRepositoryRole("OWNER", "EDITOR"),
  update
);

router.delete(
  "/:repositoryId/blogs/:blogId",
  requireAuth,
  requireRepositoryMember,
  requireRepositoryRole("OWNER"),
  remove
);

router.patch(
  "/:repositoryId/blogs/:blogId/status",
  requireAuth,
  requireRepositoryMember,
  requireRepositoryRole("OWNER", "EDITOR"),
  changeStatus
);

router.patch(
  "/:repositoryId/blogs/:blogId/archive",
  requireAuth,
  requireRepositoryMember,
  requireRepositoryRole("OWNER"),
  archive
);

export default router;