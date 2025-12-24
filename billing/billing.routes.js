import { Router } from "express";
import { authClient } from "../middlewares/authClient.js";
import {
  checkoutController,
  successController,
  failureController,
} from "./billing.controller.js";

const router = Router();

// 🔐 Criação do checkout
router.post("/checkout", authClient, checkoutController);

// ✅ Retorno Mercado Pago
router.get("/success", successController);
router.get("/failure", failureController);

export default router;