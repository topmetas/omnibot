import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";

/**
 * Limites por plano SaaS
 */
const limitsByPlan = {
  free: 50,
  eco: 300,
  pro: 1000,
};

export const rateLimitSaaS = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos

  max: (req) => {
    if (!req.client) return 20; // sem autenticação
    return limitsByPlan[req.client.plan] || 50;
  },

  keyGenerator: (req) => {
    return req.client?._id?.toString() || req.ip;
  },

  handler: (req, res) => {
    logger.warn("Rate limit atingido", {
      clientId: req.client?._id,
      plan: req.client?.plan,
      ip: req.ip,
      route: req.originalUrl,
    });

    res.status(429).json({
      error: "Muitas requisições. Aguarde alguns minutos.",
    });
  },
});