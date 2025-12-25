import { Router } from "express";

import { authClient } from "../middlewares/authClient.js";
import { rateLimitSaaS } from "../middlewares/rateLimitSaaS.js";
import { usageGuard } from "../middlewares/usageGuard.js";

import { chatController } from "../controllers/chat.controller.js";

const router = Router();

/**
 * POST /api/chat
 * Header: x-api-key
 * Body: { message }
 */
router.post(
  "/",
  authClient,      // 🔐 identifica o cliente via API Key
  rateLimitSaaS,   // ⚡ rate limit por minuto
  usageGuard,      // 📊 limite mensal por plano
  chatController   // 🤖 IA (FUNÇÃO DIRETA)
);

export default router;
