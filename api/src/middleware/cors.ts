import cors from "cors";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    callback(null, process.env.FRONTEND_URL || "http://localhost:3000");
  },
  credentials: true,
});
