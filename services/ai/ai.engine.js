import { openAIProvider } from "./openai.provider.js";
import { ollamaProvider } from "./ollama.provider.js";
import { semanticSearch } from "../embeddings/semantic.search.js";

/**
 * Função central que decide QUAL IA usar
 */
export async function generateResponse(client, message) {
  let prompt = "";

  try {
    // 1️⃣ Busca semântica (RAG)
    const context = await semanticSearch(client._id, message);

    // 2️⃣ Prompt de sistema por idioma e nicho
    const systemPrompt = `
Você é um chatbot profissional.
Responda sempre em ${client.language || "português"}.
Nicho do cliente: ${client.niche || "geral"}.
`;

    // 3️⃣ Prompt completo
    prompt = `
${systemPrompt}

Use o contexto abaixo para responder:

${context || "Nenhum contexto encontrado"}

Pergunta do usuário:
${message}
`;

    // 4️⃣ Decide qual IA usar
    if (client.aiProvider === "local") {
      return await ollamaProvider(prompt, client);
    }

    // 5️⃣ IA Premium (OpenAI)
    return await openAIProvider(prompt, client);

  } catch (error) {
    // 6️⃣ Fallback automático
    console.error("❌ Erro na IA premium. Usando IA local:", error.message);
    return await ollamaProvider(prompt || message, client);
  }
}

