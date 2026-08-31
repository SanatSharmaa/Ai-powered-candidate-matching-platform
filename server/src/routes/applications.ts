import { Router } from "express";
import { getMyApplications, updateApplicationStatus } from "../controllers/applications.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateApplicationStatusSchema } from "../types";

const router = Router();

router.get("/me", authenticate, authorize("CANDIDATE"), getMyApplications);
router.patch("/:id/status", authenticate, authorize("EMPLOYER"), validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
