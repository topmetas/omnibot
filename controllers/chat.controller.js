import { aiEngine } from "../services/ai/ai.engine.js";

/**
 * Controller do chat
 */
export async function chatController(req, res) {
  try {
    const { message } = req.body;

    // Simulação de cliente (depois vem do banco)
    const client = {
      id: "cliente_teste",
      plan: "pro", // free | eco | pro
      niche: "geral",
    };

    const response = await aiEngine(message, client);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
