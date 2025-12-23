import OpenAI from "openai";

/**
 * Inicializa o cliente da OpenAI SOMENTE
 * se a variável OPENAI_API_KEY existir.
 * Isso evita crash no plano Free.
 */

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("✅ OpenAI configurada com sucesso");
} else {
  console.warn("⚠️ OpenAI NÃO configurada. Usando apenas IA local (Ollama)");
}

export { openai };




