import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_prod";

// POST /api/auth/register
// Registers a new organization and its first admin user
router.post("/register", async (req, res, next) => {
  try {
    const { orgName, email, password } = req.body;

    if (!orgName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Organization and Admin User in a transaction
    const newOrg = await prisma.org.create({
      data: {
        name: orgName,
        users: {
          create: {
            email,
            password: hashedPassword,
            role: "ADMIN",
          },
        },
      },
      include: {
        users: true,
      },
    });

    const user = newOrg.users[0];
    const token = jwt.sign({ userId: user.id, orgId: newOrg.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role },
      org: { id: newOrg.id, name: newOrg.name },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { org: true } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, orgId: user.orgId, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
      org: { id: user.orgId, name: user.org.name },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
