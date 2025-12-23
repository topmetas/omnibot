import express from "express";
import { chat } from "../services/chat.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  const reply = await chat(null, message);

  res.json({ reply });
});

export default router;
