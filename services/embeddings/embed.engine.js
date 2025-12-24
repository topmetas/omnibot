import { openAIEmbed } from "./openai.embed.js";
import { localEmbed } from "./local.embed.js";
import logger from "../../utils/logger.js";

/**
 * Gera embedding SEM quebrar o sistema
 * Decide automaticamente:
 * - Free → local
 * - Pro → OpenAI
 */
export async function embedText(text, client) {
  try {
    const useOpenAI =
      client?.aiProvider === "openai" &&
      client?.plan !== "free";

    if (useOpenAI) {
      logger.info("Gerando embedding via OpenAI", {
        clientId: client._id,
      });
      return await openAIEmbed(text);
    }

    logger.info("Gerando embedding local", {
      clientId: client?._id,
    });
    return await localEmbed(text);

  } catch (error) {
    logger.warn("Fallback para embedding local", {
      error: error.message,
    });
    return await localEmbed(text);
  }
}