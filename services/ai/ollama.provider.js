import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/**
 * Provider Local (Ollama)
 * - NÃO conhece client
 * - NÃO monta prompt
 * - SEMPRE retorna padrão
 */
export async function ollamaProvider(prompt, options = {}) {
  const model = options.model || "mistral";

  const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
    model,
    prompt,
    stream: false,
  });

  return {
    text: response.data.response,
    tokens: response.data.eval_count || 0,
    cost: 0,
  };
}
