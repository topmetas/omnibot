import cron from "node-cron";
import Client from "../models/Client.js";

/**
 * 🔄 Reset mensal de uso
 * Executa todo dia 1 às 00:00
 */
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("🔄 Iniciando reset mensal de uso");

    await Client.updateMany(
      {},
      {
        $set: {
          "usage.messages": 0,
          "usage.bots": 0,
          "usage.tokens": 0,
          lastResetAt: new Date(),
        },
      }
    );

    console.log("✅ Uso mensal resetado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao resetar uso mensal:", error);
  }
});