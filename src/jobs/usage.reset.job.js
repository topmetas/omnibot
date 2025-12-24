import cron from "node-cron";
import Usage from "../models/Usage.js";

cron.schedule("0 0 1 * *", async () => {
  console.log("🔄 Iniciando ciclo mensal de Usage");

  // fecha todos os usages ativos
  await Usage.updateMany(
    { status: "active" },
    {
      $set: {
        status: "closed",
        endedAt: new Date(),
      },
    }
  );
});