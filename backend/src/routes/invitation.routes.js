import express from "express";

import {
  create,
  getMine,
  respond
} from "../controllers/invitation.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/repositories/:repositoryId/invitations",
  requireAuth,
  create
);

router.get(
  "/invitations",
  requireAuth,
  getMine
);

router.patch(
  "/invitations/:invitationId",
  requireAuth,
  respond
);

export default router;