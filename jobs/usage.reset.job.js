import cron from "node-cron";
import Client from "../models/Client.js";
import { checkUsageAndNotifyUpgrade } from "../services/email.service.js";

/**
 * 🔄 Reset mensal de uso
 * Executa todo dia 1 às 00:00
 */
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("🔄 Iniciando reset mensal de uso");

    const clients = await Client.find({});

    for (const client of clients) {
      // 📧 Notifica upgrade se necessário
      await checkUsageAndNotifyUpgrade(client);

      // 🔄 Reseta uso
      client.usage.messages = 0;
      client.usage.bots = 0;
      client.usage.tokens = 0;
      client.lastResetAt = new Date();

      await client.save();
    }

    console.log("✅ Uso mensal resetado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao resetar uso mensal:", error);
  }
});
