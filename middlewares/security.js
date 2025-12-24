import logger from "../utils/logger.js";

export default function securityMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ Sem token
  if (!authHeader) {
    logger.warn("Requisição sem Authorization", {
      ip: req.ip,
      method: req.method,
      path: req.originalUrl,
    });

    return res.status(401).json({
      error: "Authorization header ausente",
    });
  }

  try {
    // 👉 Exemplo: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn("Token mal formatado", {
        ip: req.ip,
        path: req.originalUrl,
      });

      return res.status(401).json({
        error: "Token inválido",
      });
    }

    // 🔐 Aqui entra SUA lógica atual:
    // validar token, buscar cliente, etc
    // req.client = client;

    logger.info("Requisição autorizada", {
      ip: req.ip,
      path: req.originalUrl,
    });

    next();
  } catch (error) {
    logger.error("Erro no securityMiddleware", {
      error,
      ip: req.ip,
      path: req.originalUrl,
    });

    return res.status(500).json({
      error: "Erro de segurança",
    });
  }
}
