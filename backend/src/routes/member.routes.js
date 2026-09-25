import { Router } from "express";

import {
  createMember,
  listMembers,
  changeMemberRole,
  deleteMember,
} from "../controllers/member.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:repositoryId/members", requireAuth, createMember);

router.get("/:repositoryId/members", requireAuth, listMembers);

router.patch("/:repositoryId/members/:memberId", requireAuth, changeMemberRole);

router.delete("/:repositoryId/members/:memberId", requireAuth, deleteMember);

export default router;
