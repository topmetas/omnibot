import "dotenv/config";
import { openai } from "../../config/openai.js";

/**
 * Provider responsável por conversar com a OpenAI (GPT)
 * Só é chamado se o cliente estiver no plano Pro
 */
export async function openAIProvider(message, client) {
  if (!openai) {
    throw new Error("OpenAI não está configurada");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Você é um assistente profissional para o nicho ${client.niche}. 
Responda de forma clara, objetiva e útil.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}



