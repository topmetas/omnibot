import Vector from "./vector.store.js";
import { embedText } from "./embed.js";

// Similaridade de cosseno
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

// Busca semântica completa
export async function semanticSearch(clientId, question, limit = 3) {
  // 1️⃣ Gerar embedding da pergunta
  const queryEmbedding = await embedText(question);

  // 2️⃣ Buscar vetores do cliente
  const vectors = await Vector.find({ clientId }).lean();
  if (!vectors.length) return "";

  // 3️⃣ Calcular similaridade
  const results = vectors
    .map(v => ({
      text: v.text,
      score: cosineSimilarity(queryEmbedding, v.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // 4️⃣ Retornar contexto final
  return results.map(r => r.text).join("\n\n");
}





