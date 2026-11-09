import { Router } from "express";

import {
  followAuthor,
  unfollowAuthor,
  getAuthorFollowStats,
  getUserFollowers,
  getUserFollowing
} from "../controllers/follow.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:userId/follow", requireAuth, followAuthor);
router.delete("/:userId/follow", requireAuth, unfollowAuthor);

router.get("/:userId/follow-stats", getAuthorFollowStats);
router.get("/:userId/followers", getUserFollowers);
router.get("/:userId/following", getUserFollowing);

export default router;