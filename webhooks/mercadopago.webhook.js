import Billing from "../models/billing.model.js";
import Client from "../models/client.model.js";

/**
 * Webhook Mercado Pago - Assinaturas
 */
export async function mercadoPagoWebhook(req, res) {
  try {
    const { id: subscriptionId, status, auto_recurring } = req.body;

    if (!subscriptionId) {
      return res.sendStatus(400);
    }

    // 🔍 1. Tenta achar cliente pela assinatura salva
    let client = await Client.findOne({
      "subscription.id": subscriptionId,
    });

    // 🔁 2. Fallback: busca no Mercado Pago se não achar
    let subscriptionData = null;

    if (!client) {
      subscriptionData = await fetch(
        `https://api.mercadopago.com/preapproval/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      ).then(res => res.json());

      if (!subscriptionData?.metadata?.clientId) {
        return res.sendStatus(404);
      }

      client = await Client.findById(subscriptionData.metadata.clientId);
      if (!client) return res.sendStatus(404);
    }

    // 🔄 3. Atualiza status da assinatura
    client.subscription = {
      id: subscriptionId,
      status,
      gateway: "mercadopago",
    };

    // 💳 4. Registra cobrança
    await Billing.create({
      clientId: client._id,
      gateway: "mercadopago",
      amount:
        auto_recurring?.transaction_amount ??
        subscriptionData?.auto_recurring?.transaction_amount ??
        0,
      status,
      referenceId: subscriptionId,
    });

    // ✅ 5. Pagamento aprovado / assinatura ativa
    if (status === "authorized" || status === "active") {
      client.subscriptionStatus = "active";
      client.planActivatedAt = new Date();
    }

    // ❌ 6. Pagamento falhou ou cancelado
    if (status === "paused" || status === "cancelled") {
      client.subscriptionStatus = "past_due";
    }

    await client.save();

    return res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);
    return res.sendStatus(500);
  }
}