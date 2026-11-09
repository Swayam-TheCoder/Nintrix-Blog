import { Router } from "express";

import {
  getMyProfile,
  updateMyProfile,
  searchUsers,
  getPublicProfile
} from "../controllers/profile.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/users/:username", getPublicProfile);

// Authenticated routes
router.get("/search", requireAuth, searchUsers);
router.get("/", requireAuth, getMyProfile);
router.patch("/", requireAuth, updateMyProfile);

export default router;