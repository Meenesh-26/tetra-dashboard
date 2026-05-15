import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { helmetMiddleware } from "./middleware/helmet";
import { corsMiddleware } from "./middleware/cors";
import { globalRateLimiter } from "./middleware/rateLimit";
import { authRateLimiter } from "./middleware/authRateLimit";
import { pinoMiddleware } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import transactionsRouter from "./routes/transactions";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(globalRateLimiter);
app.use(pinoMiddleware);

// Mount the authentication routes (with stricter rate limiting)
app.use("/api/auth", authRateLimiter, authRouter);
// Mount the transaction routes
app.use("/api/transactions", transactionsRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ API listening on http://localhost:${PORT}`));
