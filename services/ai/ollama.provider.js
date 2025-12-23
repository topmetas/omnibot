import axios from "axios";

// Função que conversa com o Ollama (LLaMA / Mistral)
export async function ollamaProvider(message, client) {
  const prompt = `
Você é um chatbot profissional treinado com o conteúdo abaixo.
Use essas informações como base principal para responder.

=== CONTEÚDO DO SITE ===
${client.siteContent}

=== CONTEXTO DO NEGÓCIO ===
Nicho: ${client.niche}

=== PERGUNTA DO USUÁRIO ===
${message}

Responda de forma clara, objetiva e profissional.
`;

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: client.model || "mistral",
      prompt,
      stream: false
    }
  );

  return response.data.response;
}
