import mp from "../config/mercadoPago.js";
import Client from "../models/client.model.js";

export async function handleMercadoPagoWebhook(req, res) {
  try {
    const { type, data } = req.body;

    if (type !== "preapproval") {
      return res.sendStatus(200);
    }

    const subscriptionId = data.id;

    const subscription = await mp.preapproval.get(subscriptionId);

    const {
      status,
      payer_email,
      metadata,
    } = subscription;

    const client = await Client.findById(metadata.clientId);

    if (!client) {
      return res.sendStatus(404);
    }

    // 🔥 ATIVA O PLANO
    if (status === "authorized") {
      client.plan = metadata.plan;
      client.subscriptionId = subscriptionId;
      client.subscriptionStatus = "active";
      client.planActivatedAt = new Date();
    }

    // ❌ CANCELADO
    if (status === "cancelled") {
      client.plan = "free";
      client.subscriptionStatus = "cancelled";
    }

    await client.save();

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Mercado Pago:", err);
    res.sendStatus(500);
  }
}