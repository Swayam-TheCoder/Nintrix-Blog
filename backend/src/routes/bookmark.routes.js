
import { Router } from "express";

import {
  add,
  remove,
  getAll,
  check
} from "../controllers/bookmark.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Get all bookmarks of logged-in user
router.get("/", requireAuth, getAll);

// Check whether a blog is bookmarked
router.get("/:blogId/check", requireAuth, check);

// Add bookmark
router.post("/:blogId", requireAuth, add);

// Remove bookmark
router.delete("/:blogId", requireAuth, remove);

export default router;
