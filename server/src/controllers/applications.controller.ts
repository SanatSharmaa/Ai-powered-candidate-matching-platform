import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest, ApplyInput } from "../types";
import { ApplicationStatus } from "@prisma/client";

export async function applyToJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id: jobId } = req.params;
    const candidateId = req.user!.userId;
    const { coverLetter } = req.body as ApplyInput;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const existingApplication = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    });

    if (existingApplication) {
      res.status(409).json({ error: "You have already applied to this job" });
      return;
    }

    const application = await prisma.application.create({
      data: { coverLetter, candidateId, jobId },
      include: {
        job: { select: { id: true, title: true, company: true } },
      },
    });

    res.status(201).json({ data: application, message: "Application submitted successfully" });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMyApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const candidateId = req.user!.userId;

    const applications = await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            employer: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: applications });
  } catch (err) {
    console.error("Get my applications error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateApplicationStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const employerId = req.user!.userId;
    const { status } = req.body as { status: ApplicationStatus };

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    if (application.job.employerId !== employerId) {
      res.status(403).json({ error: "You can only update applications for your own job postings" });
      return;
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        candidate: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: true } },
      },
    });

    res.json({ data: updated, message: "Application status updated" });
  } catch (err) {
    console.error("Update application status error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
