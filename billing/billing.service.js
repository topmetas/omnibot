import mercadopago from "./mercadoPago.js";

export async function criarAssinatura(client) {
  const priceByPlan = {
    eco: 49,
    pro: 99,
  };

  const preference = {
    items: [
      {
        title: `Plano ${client.plan.toUpperCase()}`,
        quantity: 1,
        unit_price: priceByPlan[client.plan] || 0,
      },
    ],
    back_urls: {
      success: `${process.env.BASE_URL}/api/billing/success`,
      failure: `${process.env.BASE_URL}/api/billing/failure`,
    },
    auto_return: "approved",
    metadata: {
      clientId: client._id.toString(),
      plan: client.plan,
    },
  };

  const response = await mercadopago.preferences.create(preference);

  return response.body.init_point;
}