import { Router } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Protect all transaction routes
router.use(requireAuth);

// GET /api/transactions
// Get all transactions for the user's organization
router.get("/", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;

    const transactions = await prisma.transaction.findMany({
      where: { orgId },
      orderBy: { date: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/export
// Export transactions as CSV
router.get("/export", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;

    const transactions = await prisma.transaction.findMany({
      where: { orgId },
      orderBy: { date: "desc" },
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="transactions.csv"');

    // Simple CSV generation
    let csv = "ID,Date,Category,Type,Amount\n";
    transactions.forEach((tx) => {
      csv += `${tx.id},${tx.date.toISOString()},"${tx.category || ""}",${tx.type},${tx.amount}\n`;
    });

    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions
// Create a new transaction
router.post("/", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;
    const { amount, type, category, date } = req.body;

    if (amount === undefined || !type) {
      return res.status(400).json({ error: "Amount and type are required" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        date: date ? new Date(date) : new Date(),
        orgId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/transactions/:id
// Delete a specific transaction
router.delete("/:id", async (req, res, next) => {
  try {
    const orgId = req.user!.orgId;
    const transactionId = parseInt(req.params.id);

    // Verify the transaction belongs to the org
    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existing || existing.orgId !== orgId) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
