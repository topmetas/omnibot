import { Router } from "express";
import mp from "../config/mercadoPago.js";
import Client from "../models/Client.js";
import Billing from "../models/Billing.js";
import { authJWT } from "../middlewares/authJWT.js";
import { getBillingHistory } from "../controllers/billing.controller.js";

const router = Router();

/**
 * 🔔 Criar assinatura (Mercado Pago)
 * POST /api/billing/subscribe
 */
router.post("/subscribe", authJWT, async (req, res) => {
  try {
    const { plan } = req.body;
    const client = req.client; // vem do authJWT

    if (!["eco", "pro"].includes(plan)) {
      return res.status(400).json({ error: "Plano inválido" });
    }

    const prices = {
      eco: 49,
      pro: 149,
    };

    const subscription = await mp.preapproval.create({
      reason: `Plano ${plan.toUpperCase()}`,
      payer_email: client.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: prices[plan],
        currency_id: "BRL",
      },
      back_url: `${process.env.FRONTEND_URL}/billing/success`,
    });

    // salva dados básicos da assinatura no cliente
    client.subscription = {
      id: subscription.id,
      status: "pending",
      provider: "mercadopago",
    };
    client.plan = plan;
    client.planActivatedAt = new Date();

    await client.save();

    res.json({
      checkoutUrl: subscription.init_point,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar assinatura" });
  }
});

/**
 * 📊 Histórico de cobranças
 * GET /api/billing/history
 */
router.get("/history", authJWT, getBillingHistory);

export default router;
