import { Router } from "express";

import {
  getMyProfile,
  updateMyProfile
} from "../controllers/profile.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getMyProfile);

router.patch("/", requireAuth, updateMyProfile);

export default router;