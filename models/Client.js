import mongoose from "mongoose";
import crypto from "crypto";

const ClientSchema = new mongoose.Schema(
  {
    name: String,
    domain: String,
    niche: String,

    // 🔑 API Key única por cliente
    apiKey: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(24).toString("hex")
    },

    // 💼 Plano do cliente
    plan: {
      type: String,
      enum: ["free", "eco", "pro"],
      default: "free"
    },

    // 🤖 Provedor de IA
    aiProvider: {
      type: String,
      enum: ["local", "openai"],
      default: "local"
    },

    // 📊 Limite mensal
    monthlyLimit: {
      type: Number,
      default: 100
    },

    usage: {
      type: Number,
      default: 0
    },

    // 🌍 Idioma do cliente (multi-idioma)
    language: {
      type: String,
      default: "pt-BR"
    },

    // 🎨 Branding / White-label
    brand: {
      name: {
        type: String,
        default: "Chatbot IA"
      },
      logoUrl: {
        type: String
      },
      primaryColor: {
        type: String,
        default: "#4f46e5"
      },
      domainWhiteLabel: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Client", ClientSchema);


