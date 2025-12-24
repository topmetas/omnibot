import Vector from "../../models/Vector.js";
import { embedText } from "./embed.js";
import logger from "../../utils/logger.js";

// Similaridade de cosseno
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

/**
 * Busca semântica (RAG)
 * Retorna contexto textual para IA
 */
export async function semanticSearch(clientId, question, limit = 3) {
  try {
    logger.info("Busca semântica iniciada", {
      clientId,
      question,
    });

    // 1️⃣ Gerar embedding da pergunta
    const queryEmbedding = await embedText(question, { _id: clientId });

    // 2️⃣ Buscar vetores do cliente
    const vectors = await Vector.find({ clientId }).lean();
    if (!vectors.length) {
      logger.warn("Nenhum embedding encontrado", { clientId });
      return "";
    }

    // 3️⃣ Similaridade
    const results = vectors
      .map(v => ({
        text: v.text,
        score: cosineSimilarity(queryEmbedding, v.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    logger.info("Busca semântica concluída", {
      clientId,
      resultados: results.length,
    });

    // 4️⃣ Contexto final
    return results.map(r => r.text).join("\n\n");

  } catch (error) {
    logger.error("Erro na busca semântica", {
      clientId,
      error: error.message,
    });

    return "";
  }
}





