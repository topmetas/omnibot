import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    // 🔗 Relacionamento
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      index: true,
      required: true,
    },

    sessionId: {
      type: String,
      index: true,
    },

    userId: {
      type: String, // opcional (caso o cliente tenha usuários)
    },

    // 💬 Conteúdo da conversa
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "pt-BR",
    },

    // 🤖 IA utilizada
    aiProvider: {
      type: String,
      enum: ["local", "openai"],
      required: true,
    },

    model: {
      type: String, // gpt-4o, llama3, mistral etc
    },

    temperature: {
      type: Number,
      default: 0.7,
    },

    // 📚 RAG / Contexto
    rag: {
      used: {
        type: Boolean,
        default: false,
      },
      sources: [
        {
          id: String,
          title: String,
          score: Number,
        },
      ],
    },

    // 🔢 Tokens e custo
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number,
    },

    cost: {
      type: Number, // custo real da IA
      default: 0,
    },

    // ⏱️ Performance
    latencyMs: {
      type: Number,
    },

    // 🧾 Status da mensagem
    status: {
      type: String,
      enum: ["success", "error", "blocked"],
      default: "success",
      index: true,
    },

    error: {
      message: String,
      code: String,
    },

    // 🌍 Origem
    source: {
      type: String,
      enum: ["widget", "api", "dashboard", "whatsapp"],
      default: "api",
    },

    ip: String,
    userAgent: String,

    // 🎨 Branding usado
    brandSnapshot: {
      name: String,
      primaryColor: String,
      domain: String,
    },

    // 🏷️ Tags
    tags: [String],
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

// 🔍 Índices importantes
MessageSchema.index({ clientId: 1, createdAt: -1 });
MessageSchema.index({ sessionId: 1 });
MessageSchema.index({ "rag.used": 1 });

export default mongoose.model("Message", MessageSchema);