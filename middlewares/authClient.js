import Client from "../models/Client.js";

export async function authClient(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API Key não informada" });
  }

  const client = await Client.findOne({ apiKey });

  if (!client) {
    return res.status(403).json({ error: "API Key inválida" });
  }

  // Controle simples de uso
  if (client.usage >= client.monthlyLimit) {
    return res.status(429).json({ error: "Limite mensal atingido" });
  }

  client.usage += 1;
  await client.save();

  req.client = client;
  next();
}
