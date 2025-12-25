export function checkPlanLimit(limit) {
    return (req, res, next) => {
      if (req.client.usage >= limit) {
        return res.status(403).json({
          error: "Limite do plano atingido",
        });
      }
      next();
    };
  }