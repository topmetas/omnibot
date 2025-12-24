import logger from "../utils/logger.js";

// MVP em memória (pode trocar depois)
const vectors = [];

export async function saveVector({ clientId, text, embedding }) {
  vectors.push({ clientId, text, embedding });

  logger.info("Embedding salvo", {
    clientId,
    size: embedding.length,
  });
}

export async function searchVector({ clientId, embedding, limit = 3 }) {
  // MVP: retorna textos do mesmo cliente
  const results = vectors
    .filter(v => v.clientId.toString() === clientId.toString())
    .slice(0, limit);

  logger.info("Busca vetorial executada", {
    clientId,
    results: results.length,
  });

  return results;
}