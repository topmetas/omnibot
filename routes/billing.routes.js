import express from "express";
import mp from "../config/mercadoPago.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email, plan } = req.body;

  const price = plan === "pro" ? 149 : 49;

  const subscription = await mp.preapproval.create({
    reason: `Plano ${plan}`,
    payer_email: email,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: price,
      currency_id: "BRL"
    }
  });

  res.json(subscription.init_point);
});

export default router;
