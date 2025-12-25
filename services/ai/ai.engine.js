import { openAIProvider } from "./openai.provider.js";
import { ollamaProvider } from "./ollama.provider.js";
import { semanticSearch } from "../embeddings/semantic.search.js";
import { registerUsage } from "../usage/usage.services.js";

/**
 * ENGINE CENTRAL DE IA
 * - RAG
 * - Controle de plano
 * - Billing / Usage
 * - Fallback automático
 */
export async function generateResponse(client, message, source = "api") {
  let prompt = "";

  try {
    // 🔎 RAG / Busca semântica
    const context = await semanticSearch(client._id, message);

    // 🧠 Prompt padrão SaaS
    prompt = `
Você é um assistente profissional.
Responda sempre em ${client.language || "português"}.
Nicho do cliente: ${client.niche || "geral"}.

Contexto:
${context || "Nenhum contexto encontrado"}

Pergunta do usuário:
${message}
`;

    // 🔐 Controle de plano
    const provider =
      client.aiProvider === "openai" && client.plan !== "free"
        ? "openai"
        : "local";

    let response;

    // 🤖 Decide IA
    if (provider === "openai") {
      response = await openAIProvider(prompt, client);
    } else {
      response = await ollamaProvider(prompt, client);
    }

    // 📊 Registro de uso
    await registerUsage({
      client,
      tokens: response.tokens || 0,
      cost: response.cost || 0,
      provider,
      source,
    });

    return response.text;

  } catch (error) {
    console.error("❌ Erro IA premium → fallback local:", error.message);

    // 🔁 Fallback local
    const fallback = await ollamaProvider(prompt || message, client);

    await registerUsage({
      client,
      tokens: fallback.tokens || 0,
      cost: 0,
      provider: "local",
      source,
    });

    return fallback.text;
  }
}