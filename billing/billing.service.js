import { mpClient } from "../config/mercadoPago.js";
import { PLANS } from "../config/plans.config.js";
import { createSubscriptionPayPal } from "./paypal.service.js";

/**
 * 🔔 GERAR ASSINATURA (MULTI-GATEWAY)
 */
export async function gerarAssinatura(data) {
  const { gateway } = data;

  if (gateway === "paypal") {
    return createSubscriptionPayPal(data);
  }

  // Default: Mercado Pago
  return createSubscriptionMercadoPago(data);
}

/**
 * 🔔 GERAR ASSINATURA - MERCADO PAGO
 */
async function createSubscriptionMercadoPago({ client, plan }) {
  const plano = PLANS[plan];

  if (!plano) {
    throw new Error("Invalid plan");
  }

  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mpClient.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: `OmniBot Plan ${plan.toUpperCase()}`,
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
    throw new Error(subscription.message || "Failed to create subscription");
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
    provider: "mercadopago",
  };
}

/**
 * ❌ CANCEL SUBSCRIPTION (MERCADO PAGO)
 */
export async function cancelarAssinatura(client) {
  if (!client.subscription?.id) {
    throw new Error("Client does not have an active subscription");
  }

  if (client.subscription.provider === "paypal") {
    // optional: delegate to PayPal cancel service
    throw new Error("PayPal cancel not implemented yet");
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
    throw new Error("Failed to cancel subscription");
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