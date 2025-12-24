import { criarAssinatura } from "./billing.service.js";
import Client from "../models/Client.js";
import logger from "../utils/logger.js";

export async function checkoutController(req, res) {
  try {
    const client = req.client;

    const checkoutUrl = await criarAssinatura(client);

    logger.info("Checkout Mercado Pago criado", {
      clientId: client._id,
      plan: client.plan,
    });

    res.json({
      success: true,
      checkoutUrl,
    });
  } catch (error) {
    logger.error("Erro ao criar checkout", {
      error: error.message,
    });

    res.status(500).json({
      success: false,
      error: "Erro ao criar checkout",
    });
  }
}

// 🔁 Sucesso
export async function successController(req, res) {
  res.send("✅ Pagamento aprovado! Plano será ativado.");
}

// ❌ Falha
export async function failureController(req, res) {
  res.send("❌ Pagamento não concluído.");
}