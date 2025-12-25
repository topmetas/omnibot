import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import "./jobs/payment.retry.job.js";

// 🔌 Banco de dados
import connectDB from "./config/database.js";
// se usar outro caminho:
// import { connectDB } from "./config/db.js";

// 🧩 Rotas
import chatRoutes from "./routes/chat.routes.js";
import clientRoutes from "./routes/client.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import configRoutes from "./routes/config.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import billingRoutes from "./billing/billing.routes.js";
import { startWhatsApp } from "./services/whatsapp.service.js";


// 🔁 Jobs / CRON
import "./jobs/usage.reset.job.js";

// 🛡️ Middlewares
import securityMiddleware from "./middlewares/security.js";
import limiter from "./middlewares/rateLimit.js";

// 🧠 Logger
import logger from "./utils/logger.js";

dotenv.config();
connectDB();

const app = express();

// 🔐 Middlewares globais
app.use(cors());
app.use(express.json());
app.use(helmet());

// Segurança extra (se existir)
app.use(securityMiddleware);
app.use(limiter);

// 🚏 Rotas
app.use("/api/chat", chatRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/config", configRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/billing", billingRoutes);

// 🏠 Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 OmniBot API está rodando",
    uptime: process.uptime(),
  });
});

// 🔔 Inicia WhatsApp
startWhatsApp();

// 🚀 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Servidor iniciado com sucesso", {
    port: PORT,
    env: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});