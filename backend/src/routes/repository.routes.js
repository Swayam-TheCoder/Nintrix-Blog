import { Router } from "express";

import {
  create,
  getMine,
  getOne,
  update,
  remove,
} from "../controllers/repository.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, create);

router.get("/", requireAuth, getMine);

router.get("/:repositoryId", requireAuth, getOne);

router.patch("/:repositoryId", requireAuth, update);

router.delete("/:repositoryId", requireAuth, remove);

export default router;
