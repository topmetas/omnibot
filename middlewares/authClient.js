import Client from "../models/Client.js";
import logger from "../utils/logger.js";

export async function authClient(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    // ❌ API Key ausente
    if (!apiKey) {
      logger.warn("API Key não informada", {
        ip: req.ip,
        route: req.originalUrl,
      });

      return res.status(401).json({
        error: "API Key não informada",
      });
    }

    const client = await Client.findOne({ apiKey });

    // ❌ API Key inválida
    if (!client) {
      logger.warn("API Key inválida", {
        ip: req.ip,
        route: req.originalUrl,
      });

      return res.status(403).json({
        error: "API Key inválida",
      });
    }

    // 🔒 Conta bloqueada
    if (client.status === "blocked") {
      logger.warn("Cliente bloqueado tentou acessar API", {
        clientId: client._id,
        route: req.originalUrl,
      });

      return res.status(403).json({
        error: "Conta bloqueada. Entre em contato com o suporte.",
      });
    }

    // ✅ Autenticação OK
    logger.info("Cliente autenticado", {
      clientId: client._id,
      route: req.originalUrl,
    });

    req.client = client;
    next();

  } catch (error) {
    // ❌ Erro interno
    logger.error("Erro no authClient", {
      error: error.message,
      stack: error.stack,
      route: req.originalUrl,
    });

    return res.status(500).json({
      error: "Erro interno de autenticação",
    });
  }
}