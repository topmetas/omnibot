import axios from "axios";

export async function callOllama(prompt) {
  const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
    model: "llama3",
    prompt,
    stream: false,
  });

  return response.data.response;
}

