import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest, CreateJobInput, UpdateJobInput, JobQuery } from "../types";
import { Prisma } from "@prisma/client";

export async function listJobs(req: Request, res: Response): Promise<void> {
  try {
    const { search, location, type, minSalary, maxSalary, page, limit } = req.query as unknown as JobQuery;

    const where: Prisma.JobWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type) {
      where.type = type;
    }

    if (minSalary !== undefined) {
      where.salaryMax = { gte: minSalary };
    }

    if (maxSalary !== undefined) {
      where.salaryMin = { lte: maxSalary };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          employer: { select: { id: true, name: true, email: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("List jobs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getJob(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json({ data: job });
  } catch (err) {
    console.error("Get job error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const input = req.body as CreateJobInput;
    const employerId = req.user!.userId;

    if (input.salaryMin > input.salaryMax) {
      res.status(400).json({ error: "Minimum salary cannot exceed maximum salary" });
      return;
    }

    const job = await prisma.job.create({
      data: { ...input, employerId },
      include: {
        employer: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ data: job, message: "Job posted successfully" });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = req.body as UpdateJobInput;
    const employerId = req.user!.userId;

    const existing = await prisma.job.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (existing.employerId !== employerId) {
      res.status(403).json({ error: "You can only edit your own job postings" });
      return;
    }

    const salaryMin = input.salaryMin ?? existing.salaryMin;
    const salaryMax = input.salaryMax ?? existing.salaryMax;
    if (salaryMin > salaryMax) {
      res.status(400).json({ error: "Minimum salary cannot exceed maximum salary" });
      return;
    }

    const job = await prisma.job.update({
      where: { id },
      data: input,
      include: {
        employer: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ data: job, message: "Job updated successfully" });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const employerId = req.user!.userId;

    const existing = await prisma.job.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (existing.employerId !== employerId) {
      res.status(403).json({ error: "You can only delete your own job postings" });
      return;
    }

    await prisma.job.delete({ where: { id } });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getJobApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const employerId = req.user!.userId;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.employerId !== employerId) {
      res.status(403).json({ error: "You can only view applications for your own jobs" });
      return;
    }

    const applications = await prisma.application.findMany({
      where: { jobId: id },
      include: {
        candidate: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: applications });
  } catch (err) {
    console.error("Get job applications error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
