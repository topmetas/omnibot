import { mpClient } from "../config/mercadoPago.js";
import { PLANS } from "../config/plans.config.js";

/**
 * 🔔 GERAR ASSINATURA
 */
export async function gerarAssinatura({ client, plan }) {
  const plano = PLANS[plan];

  if (!plano) {
    throw new Error("Plano inválido");
  }

  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mpClient.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: `Plano OmniBot ${plan.toUpperCase()}`,
      payer_email: client.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plano.price,
        currency_id: "BRL",
      },
      back_url: `${process.env.BASE_URL}/billing/success`,
      status: "pending",
      metadata: {
        clientId: client._id.toString(),
        plan,
      },
    }),
  });

  const subscription = await response.json();

  if (!response.ok) {
    throw new Error(subscription.message || "Erro ao criar assinatura");
  }

  client.plan = plan;
  client.planActivatedAt = new Date();
  client.subscription = {
    id: subscription.id,
    status: subscription.status,
    provider: "mercadopago",
  };

  await client.save();

  return {
    init_point: subscription.init_point,
    subscriptionId: subscription.id,
  };
}

/**
 * ❌ CANCELAR ASSINATURA
 */
export async function cancelarAssinatura(client) {
  if (!client.subscription?.id) {
    throw new Error("Cliente não possui assinatura ativa");
  }

  const response = await fetch(
    `https://api.mercadopago.com/preapproval/${client.subscription.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${mpClient.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "cancelled" }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao cancelar assinatura");
  }

  client.plan = "free";
  client.subscription = {
    id: null,
    status: "cancelled",
    provider: "mercadopago",
  };
  client.planActivatedAt = null;

  await client.save();

  return true;
}