import Billing from "../models/billing.model.js";
import Client from "../models/client.model.js";

export async function mercadoPagoWebhook(req, res) {
  const { id: subscriptionId, status, auto_recurring } = req.body;

  const client = await Client.findOne({
    "subscription.id": subscriptionId,
  });

  if (!client) {
    return res.sendStatus(404);
  }

  // Atualiza status da assinatura
  client.subscription.status = status;

  // Salva cobrança
  await Billing.create({
    clientId: client._id,
    gateway: "mercadopago",
    amount: auto_recurring?.transaction_amount ?? 0,
    status,
    referenceId: subscriptionId,
  });

  // Ativa plano se pagamento aprovado
  if (status === "authorized" || status === "active") {
    client.planActivatedAt = new Date();
  }

  await client.save();

  res.sendStatus(200);
}