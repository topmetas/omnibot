import { Router } from "express";
import { handleMercadoPagoWebhook } from "../billing/webhook.handler.js";

const router = Router();

router.post("/mercadopago", handleMercadoPagoWebhook);

export default router;