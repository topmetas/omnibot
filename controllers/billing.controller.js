import Billing from "../models/Billing.js";

/**
 * Histórico de cobranças do cliente autenticado
 */
export async function getBillingHistory(req, res) {
  try {
    const client = req.client; // definido pelo authClient (API Key)

    if (!client) {
      return res.status(401).json({ error: "Cliente não autenticado" });
    }

    const history = await Billing.find({
      clientId: client._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Erro ao buscar histórico de cobrança:", error);

    res.status(500).json({
      success: false,
      error: "Erro ao buscar histórico de cobrança",
    });
  }
}