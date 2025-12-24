import { pipeline } from "@xenova/transformers";
import logger from "../../utils/logger.js";

let embedder;

export async function localEmbed(text) {
  try {
    if (!embedder) {
      logger.info("Inicializando embedder local (Xenova)");
      embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }

    const output = await embedder(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);

  } catch (error) {
    logger.error("Erro ao gerar embedding local", {
      error: error.message,
    });
    throw error;
  }
}