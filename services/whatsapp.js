import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { generateResponse } from "../ai/generateResponse.js";
import { getClientConfig } from "../clients/client.service.js";

const whatsapp = new Client();

whatsapp.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

whatsapp.on("ready", () => {
  console.log("WhatsApp conectado!");
});

whatsapp.on("message", async msg => {
  try {
    // 1️⃣ Ignora mensagens vazias ou de grupo (opcional)
    if (!msg.body || msg.from.includes("@g.us")) return;

    // 2️⃣ Identifica o cliente (empresa, usuário, etc)
    const clientConfig = await getClientConfig(msg.from);

    // 3️⃣ Chama SUA engine de IA
    const response = await generateResponse(
      clientConfig,
      msg.body
    );

    // 4️⃣ Responde no WhatsApp
    if (response) {
      await msg.reply(response);
    }

  } catch (error) {
    console.error("Erro no WhatsApp bot:", error);
    await msg.reply("⚠️ Ocorreu um erro. Tente novamente.");
  }
});

export function startWhatsApp() {
  whatsapp.initialize();
}
