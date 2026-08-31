import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken } from "../middleware/auth";
import { RegisterInput, LoginInput } from "../types";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body as RegisterInput;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(201).json({
      data: { user, token },
      message: "Account created successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
