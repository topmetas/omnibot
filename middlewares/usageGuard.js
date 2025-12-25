import logger from "../utils/logger.js";
import Usage from "../models/Usage.js";

/**
 * Bloqueia cliente que excedeu cota mensal
 */
export async function usageGuard(req, res, next) {
  try {
    if (!req.client) return next();

    const usage = await Usage.findOne({ clientId: req.client._id });

    if (!usage) return next();

    const limitByPlan = {
      free: 1000,
      eco: 10000,
      pro: 100000,
    };

    const limit = limitByPlan[req.client.plan] || 1000;

    if (usage.messages >= limit) {
      logger.warn("Cota mensal excedida", {
        clientId: req.client._id,
        plan: req.client.plan,
        messages: usage.messages,
      });

      return res.status(402).json({
        error: "Cota mensal excedida. Faça upgrade do plano.",
      });
    }

    next();
  } catch (error) {
    logger.error("Erro no usageGuard", {
      error: error.message,
      clientId: req.client?._id,
    });

    return res.status(500).json({
      error: "Erro interno de uso",
    });
  }
}