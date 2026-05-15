import { Router } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";
import bcrypt from "bcryptjs";

const router = Router();

// Protect all user routes with Auth and Admin checks
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/users
// Get all users for the organization
router.get("/", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;

    const users = await prisma.user.findMany({
      where: { orgId },
      select: {
        id: true,
        email: true,
        role: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// POST /api/users
// Create a new user in the organization
router.post("/", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (role !== "ADMIN" && role !== "USER") {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if user already exists across the whole system (emails are unique)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        orgId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
