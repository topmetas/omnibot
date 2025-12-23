import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

router.post("/client", async (req, res) => {
  const client = await Client.create(req.body);
  res.json(client);
});

export default router;
