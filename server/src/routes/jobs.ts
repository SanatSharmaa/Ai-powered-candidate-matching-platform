import { Router } from "express";
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
} from "../controllers/jobs.controller";
import { applyToJob } from "../controllers/applications.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createJobSchema, updateJobSchema, applySchema, jobQuerySchema } from "../types";

const router = Router();

router.get("/", validate(jobQuerySchema, "query"), listJobs);
router.get("/:id", getJob);

router.post("/", authenticate, authorize("EMPLOYER"), validate(createJobSchema), createJob);
router.put("/:id", authenticate, authorize("EMPLOYER"), validate(updateJobSchema), updateJob);
router.delete("/:id", authenticate, authorize("EMPLOYER"), deleteJob);

router.post("/:id/apply", authenticate, authorize("CANDIDATE"), validate(applySchema), applyToJob);
router.get("/:id/applications", authenticate, authorize("EMPLOYER"), getJobApplications);

export default router;
