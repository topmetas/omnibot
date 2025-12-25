import { mpClient } from "../config/mercadoPago.js";
import Client from "../models/Client.js";
import cron from "node-cron";

cron.schedule("0 3 * * *", retryPayments);

/**
 * 🔁 Retry automático de pagamentos falhos
 */
export async function retryPayments() {
  const clients = await Client.find({
    "subscription.status": "past_due",
  });

  for (const client of clients) {
    try {
      await fetch(
        `https://api.mercadopago.com/preapproval/${client.subscription.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${mpClient.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "authorized" }),
        }
      );

      console.log(`🔁 Retry enviado para ${client.email}`);
    } catch (err) {
      console.error(
        `❌ Falha no retry de ${client.email}`,
        err.message
      );
    }
  }
}