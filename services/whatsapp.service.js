import Client from "../models/Client.js";
import { Client as WhatsAppClient } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { generateResponse } from "../services/ai/ai.engine.js";

let whatsapp;

async function getClientConfig(phone) {
  const normalizedPhone = phone.replace(/\D/g, "");

  return Client.findOne({
    whatsapp: normalizedPhone,
    isActive: true,
  });
}

/**
 * 🚀 Inicializa o WhatsApp Bot
 */
export function startWhatsApp() {
  whatsapp = new WhatsAppClient();

  whatsapp.on("qr", qr => {
    qrcode.generate(qr, { small: true });
  });

  whatsapp.on("ready", () => {
    console.log("✅ WhatsApp conectado!");
  });

  whatsapp.on("message", async msg => {
    try {
      // Ignora grupos
      if (!msg.body || msg.from.includes("@g.us")) return;

      const clientConfig = await getClientConfig(msg.from);

      if (!clientConfig) {
        return msg.reply("❌ Cliente não autorizado.");
      }

      const response = await generateResponse(
        clientConfig,
        msg.body,
        "whatsapp"
      );

      if (response) {
        await msg.reply(response);
      }

    } catch (error) {
      console.error("❌ Erro no WhatsApp bot:", error);
      await msg.reply("⚠️ Ocorreu um erro. Tente novamente.");
    }
  });

  whatsapp.initialize();
}

/**
 * 📲 Envio ativo de mensagens
 */
export async function sendWhatsAppMessage(phone, message) {
  try {
    if (!whatsapp) {
      console.warn("⚠️ WhatsApp não inicializado");
      return;
    }

    const formatted = phone.includes("@c.us")
      ? phone
      : `${phone.replace(/\D/g, "")}@c.us`;

    await whatsapp.sendMessage(formatted, message);
    console.log(`📲 WhatsApp enviado para ${phone}`);
  } catch (err) {
    console.error("❌ Erro ao enviar WhatsApp:", err.message);
  }
}


