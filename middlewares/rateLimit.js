import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  handler: (req, res) => {
    logger.warn("Rate limit excedido", {
      ip: req.ip,
      route: req.originalUrl,
    });

    res.status(429).json({ error: "Muitas requisições" });
  },
});

export default limiter;
