import axios from "axios";
import { saveVector } from "./vector.store.js";
import logger from "../utils/logger.js";

export async function ingestSite(url, clientId) {
  logger.info("Iniciando ingestão de site", { url, clientId });

  const { data: html } = await axios.get(url);

  // MVP simples
  const text = html
    .replace(/<[^>]*>/g, "")
    .slice(0, 5000);

  // ⚠️ Aqui futuramente entra embedding real
  const fakeEmbedding = Array(384).fill(Math.random());

  await saveVector({
    clientId,
    text,
    embedding: fakeEmbedding,
  });

  logger.info("Ingestão concluída", { clientId, url });
}