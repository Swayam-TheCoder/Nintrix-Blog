import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  create,
  getMine,
  getOne,
  update,
  remove
} from "../controllers/repository.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/", create);

router.get("/", getMine);

router.get("/:repositoryId", getOne);

router.patch("/:repositoryId", update);

router.delete("/:repositoryId", remove);

export default router;