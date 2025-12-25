import { Router } from "express";

const router = Router();

/**
 * GET /clients
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Lista de clientes (placeholder)",
  });
});

/**
 * POST /clients
 */
router.post("/", (req, res) => {
  const { name, email } = req.body;

  res.status(201).json({
    success: true,
    message: "Cliente criado com sucesso",
    data: {
      name,
      email,
    },
  });
});

/**
 * PUT /clients/:id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `Cliente ${id} atualizado`,
  });
});

/**
 * DELETE /clients/:id
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `Cliente ${id} removido`,
  });
});

export default router;