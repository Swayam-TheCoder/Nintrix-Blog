import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/protected", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.user
  });
});

export default router;