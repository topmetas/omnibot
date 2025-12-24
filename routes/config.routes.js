import { Router } from "express";
import { authClient } from "../middlewares/authClient.js";

const router = Router();

router.get("/config", authClient, (req, res) => {
  const { brand } = req.client;

  res.json({
    brandName: brand.name,
    logoUrl: brand.logoUrl,
    primaryColor: brand.primaryColor,
    removeBranding: brand.removeBranding,
  });
});

export default router;