import cron from "node-cron";
import Client from "../models/Client.js";
import { mpClient } from "../config/mercadoPago.js";
import { sendPaymentRetryEmail } from "../services/email.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";

/**
 * 🔁 Retry automático de pagamentos falhos
 * Executa todos os dias às 03:00
 */
cron.schedule("0 3 * * *", async () => {
  console.log("🔁 Iniciando job de retry de pagamentos");

  try {
    const clients = await Client.find({
      "subscription.status": "past_due",
      "subscription.provider": "mercadopago",
    });

    for (const client of clients) {
      try {
        // 🔄 Tenta reativar assinatura no Mercado Pago
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

        // 📧 Email de aviso
        if (client.email) {
          await sendPaymentRetryEmail(client.email);
        }

        // 📲 WhatsApp (opcional)
        if (client.phone) {
          await sendWhatsAppMessage(
            client.phone,
            "⚠️ Tentamos processar novamente sua assinatura. Verifique seu meio de pagamento."
          );
        }
      } catch (error) {
        console.error(
          `❌ Falha no retry de ${client.email}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Erro geral no job de retry:", error.message);
  }
});

