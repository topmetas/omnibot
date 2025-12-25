import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// 🔌 Banco de dados
import connectDB from "./config/database.js";

// 🧩 Rotas
import chatRoutes from "./routes/chat.routes.js";
import clientRoutes from "./routes/client.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import configRoutes from "./routes/config.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import billingRoutes from "./billing/billing.routes.js";

// 🔁 Jobs / CRON
import "./jobs/payment.retry.job.js";
import "./jobs/usage.reset.job.js";

// 🛡️ Middlewares
import securityMiddleware from "./middlewares/security.js";
import limiter from "./middlewares/rateLimit.js";

// 🧠 Logger
import logger from "./utils/logger.js";

// 📲 WhatsApp Service
import { startWhatsApp } from "./services/whatsapp.service.js";

dotenv.config();

// ─────────────────────────────────────────────
// 🔌 Conecta ao banco
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// 🚀 App
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// 🔐 Middlewares globais
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(securityMiddleware);
app.use(limiter);

// ─────────────────────────────────────────────
// 🚏 Rotas
// ─────────────────────────────────────────────
app.use("/api/chat", chatRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/config", configRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/billing", billingRoutes);

// ─────────────────────────────────────────────
// 🏠 Health Check
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 OmniBot API está rodando",
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

// ─────────────────────────────────────────────
// 📲 Inicializa WhatsApp (condicional)
// ─────────────────────────────────────────────
if (process.env.ENABLE_WHATSAPP === "true") {
  startWhatsApp();
  logger.info("📲 WhatsApp habilitado");
} else {
  logger.warn("📴 WhatsApp desativado via ENV");
}

// ─────────────────────────────────────────────
// 🚀 Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Servidor iniciado com sucesso", {
    port: PORT,
    env: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});
