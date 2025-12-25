import { PLANS } from "../config/plans.config.js";

export function usageLimitMiddleware(req, res, next) {
  const client = req.client;

  if (!client) {
    return res.status(401).json({
      error: "Cliente não autenticado",
    });
  }

  const planConfig = PLANS[client.plan];

  if (!planConfig) {
    return res.status(400).json({
      error: "Plano do cliente inválido",
    });
  }

  const messageLimit = planConfig.limits.messages;

  if (client.usage.messages >= messageLimit) {
    return res.status(403).json({
      error: "Limite mensal de mensagens do plano atingido",
    });
  }

  next();
}