import { Request } from "express";
import { Role } from "@prisma/client";
import { z } from "zod";

export interface AuthPayload {
  userId: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// --------------- Validation Schemas ---------------

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["EMPLOYER", "CANDIDATE"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  type: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
  salaryMin: z.number().int().min(0, "Minimum salary must be non-negative"),
  salaryMax: z.number().int().min(0, "Maximum salary must be non-negative"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
});

export const updateJobSchema = createJobSchema.partial();

export const applySchema = z.object({
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]),
});

export const jobQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  minSalary: z.coerce.number().int().optional(),
  maxSalary: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
export type JobQuery = z.infer<typeof jobQuerySchema>;
