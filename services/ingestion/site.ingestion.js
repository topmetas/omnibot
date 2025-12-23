import axios from "axios";
import { embedText } from "../embeddings/embed.js";
import Document from "../../models/Document.js";

/**
 * Faz leitura do site e gera embeddings
 */
export async function ingestSite(clientId, url) {
  const html = await axios.get(url);
  const text = html.data.replace(/<[^>]*>/g, "");

  const embedding = await embedText(text);

  await Document.create({
    clientId,
    content: text,
    embedding,
  });
}
