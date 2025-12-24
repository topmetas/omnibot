import "dotenv/config";
import { openai } from "../../config/openai.js";
import logger from "../../utils/logger.js"; // winston ou console wrapper

/**
 * Provider OpenAI
 * - Recebe PROMPT pronto
 * - Usa dados do client apenas para contexto
 * - Retorna formato padronizado
 */
export async function openAIProvider(prompt, client) {
  if (!openai) {
    throw new Error("OpenAI não configurada");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: client.model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um assistente profissional.
Nicho do cliente: ${client.niche || "geral"}
Idioma: ${client.language || "pt-BR"}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const tokens = completion.usage?.total_tokens || 0;

    // 💰 Cálculo simples de custo (ajuste depois por modelo)
    const cost = (tokens / 1_000_000) * 0.15;

    // 🧾 LOG DE SUCESSO
    logger.info("OpenAI response generated", {
      clientId: client._id,
      model: client.model || "gpt-4o-mini",
      tokens,
      cost,
    });

    return {
      text,
      tokens,
      cost,
    };

  } catch (error) {
    // ❌ LOG DE ERRO (IMPORTANTÍSSIMO EM SaaS)
    logger.error("OpenAI provider error", {
      clientId: client?._id,
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
}