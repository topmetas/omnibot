import mongoose from "mongoose";
import crypto from "crypto";

const ClientSchema = new mongoose.Schema(
  {
    // 🏷️ Dados básicos
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      index: true,
    },

    domain: String,
    niche: String,

    // 🔑 API Key única por cliente
    apiKey: {
      type: String,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(24).toString("hex"),
    },

    apiKeyLastResetAt: Date,

    // 💼 Plano
    plan: {
      type: String,
      enum: ["free", "eco", "pro"],
      default: "free",
    },

    planActivatedAt: Date,

    // 💳 Assinatura (Mercado Pago / Stripe)
    subscription: {
      id: String, // ← substitui subscriptionId
      status: {
        type: String,
        enum: ["pending", "active", "cancelled"],
        default: "pending",
      }, // ← substitui subscriptionStatus
      provider: {
        type: String,
        enum: ["mercadopago", "stripe"],
      },
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
      domain: String,
      domainWhiteLabel: String,
      removeBranding: {
        type: Boolean,
        default: false,
      },
    },

    // 📊 Limites do plano (configurados por plano)
    limits: {
      monthlyMessages: {
        type: Number,
        default: 100,
      },
      monthlyTokens: {
        type: Number,
        default: 0,
      },
      bots: {
        type: Number,
        default: 1, // ← veio do schema antigo
      },
      rateLimitPerMinute: {
        type: Number,
        default: 30,
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
      bots: {
        type: Number,
        default: 0, // ← veio do schema antigo
      },
    },

    // 🕒 Controle de ciclo
    lastResetAt: {
      type: Date,
      default: Date.now,
    },

    // 🧾 Auditoria
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", ClientSchema);