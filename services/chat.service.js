import Client from "../models/Client.js";
import { generateResponse } from "./ai/ai.engine.js";

/**
 * Função central do chat
 */
export async function chat(apiKey, message) {
  if (!apiKey) {
    return "API Key não informada";
  }

  // 1️⃣ Busca cliente pela API Key
  const client = await Client.findOne({ apiKey });

  if (!client) {
    return "Cliente não encontrado ou API Key inválida";
  }

  // 2️⃣ Controle de uso (opcional, mas recomendado)
  if (client.usage >= client.monthlyLimit) {
    return "Limite mensal atingido. Faça upgrade do plano.";
  }

  // 3️⃣ Incrementa uso
  client.usage += 1;
  await client.save();

  // 4️⃣ Gera resposta da IA
  return await generateResponse(client, message);
}
