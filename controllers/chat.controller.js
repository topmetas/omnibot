import { generateResponse } from "../services/ai/ai.engine.js";
import logger from "../utils/logger.js";

export async function chatController(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem não informada" });
    }

    const response = await generateResponse(
      req.client,
      message,
      "api"
    );

    logger.info("Mensagem processada", {
      clientId: req.client._id,
    });

    res.json({
      success: true,
      response,
    });

  } catch (error) {
    logger.error("Erro no chatController", {
      error: error.message,
    });

    res.status(500).json({
      success: false,
      error: "Erro ao processar mensagem",
    });
  }
}
