import mongoose from "mongoose";
import crypto from "crypto";

const ClientSchema = new mongoose.Schema(
  {
    // 🏷️ Dados básicos
    name: { type: String, required: true },
    email: { type: String },
    domain: { type: String },
    niche: { type: String },

    // 🔑 API Key única por cliente
    apiKey: {
      type: String,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(24).toString("hex"),
    },

    // 💼 Plano do cliente
    plan: {
      type: String,
      enum: ["free", "eco", "pro"],
      default: "free",
    },

    // 🤖 Provedor de IA
    aiProvider: {
      type: String,
      enum: ["local", "openai"],
      default: "local",
    },

    // 🌍 Idioma
    language: {
      type: String,
      default: "pt-BR",
    },

    // 🎨 White-label / Branding
    brand: {
      name: {
        type: String,
        default: "Chatbot IA",
      },
      logoUrl: String,
      primaryColor: {
        type: String,
        default: "#4f46e5",
      },
      domain: String, // domínio principal
      domainWhiteLabel: String,
      removeBranding: {
        type: Boolean,
        default: false,
      },
    },

    // 📊 Limites do plano
    limits: {
      monthlyMessages: {
        type: Number,
        default: 100,
      },
      monthlyTokens: {
        type: Number,
        default: 0,
      },
    },

    // 📈 Uso atual
    usage: {
      messages: {
        type: Number,
        default: 0,
      },
      tokens: {
        type: Number,
        default: 0,
      },
    },

    // 🕒 Controle
    lastResetAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", ClientSchema);

