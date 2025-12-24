import { openai } from "../../config/openai.js";
import logger from "../../utils/logger.js";

export async function openAIEmbed(text) {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;

  } catch (error) {
    logger.error("Erro ao gerar embedding OpenAI", {
      error: error.message,
    });
    throw error;
  }
}