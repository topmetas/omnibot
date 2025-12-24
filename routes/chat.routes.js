import { Router } from "express";
import { authClient } from "../middlewares/authClient.js";
import { rateLimitSaaS } from "../middlewares/rateLimitSaaS.js";
import { usageGuard } from "../middlewares/usageGuard.js";
import { chatController } from "../controllers/chat.controller.js";

const router = Router();

/**
 * POST /api/chat
 * Corpo: { message: string }
 * Header: x-api-key
 */
router.post(
  "/",
  authClient,       // 🔐 identifica cliente
  rateLimitSaaS,    // ⚡ limite por tempo (SaaS)
  usageGuard,       // 📊 limite mensal
  chatController    // 🤖 IA
);

export default router;
