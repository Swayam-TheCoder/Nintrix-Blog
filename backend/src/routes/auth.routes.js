import { Router } from "express";
import {
  signup,
  login,
  logout,
  me,
  refresh,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", requireAuth, resetPassword);

router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

export default router;