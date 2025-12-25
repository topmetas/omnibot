import { Router } from "express";

const router = Router();

/**
 * GET /stats
 * Estatísticas gerais do sistema
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      users: 0,
      clients: 0,
      messagesSent: 0,
      activeBots: 0,
    },
    message: "Estatísticas carregadas com sucesso",
  });
});

export default router;