import { Router } from "express";
import { gerarAssinatura } from "../billing/billing.service.js";

const router = Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email, plan, clientId } = req.body;

    const result = await gerarAssinatura({
      email,
      plan,
      clientId,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

export default router;