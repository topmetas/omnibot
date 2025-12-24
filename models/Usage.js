import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema(
  {
    // 🔗 Relacionamento
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    // 📅 Período de apuração (billing cycle)
    period: {
      month: {
        type: Number, // 1–12
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    },

    // 💼 Snapshot do plano (histórico)
    planSnapshot: {
      name: {
        type: String,
        enum: ["free", "eco", "pro"],
        required: true,
      },

      limits: {
        messages: Number,
        tokens: Number,
      },

      price: {
        type: Number, // valor do plano no período
        default: 0,
      },
    },

    // 📈 Uso agregado
    usage: {
      messages: {
        type: Number,
        default: 0,
      },

      tokens: {
        type: Number,
        default: 0,
      },

      cost: {
        type: Number, // custo real da IA
        default: 0,
      },
    },

    // 🔍 Breakdown por IA
    byProvider: {
      local: {
        messages: { type: Number, default: 0 },
        tokens: { type: Number, default: 0 },
      },
      openai: {
        messages: { type: Number, default: 0 },
        tokens: { type: Number, default: 0 },
        cost: { type: Number, default: 0 },
      },
    },

    // 🌍 Origem do consumo
    bySource: {
      widget: { type: Number, default: 0 },
      api: { type: Number, default: 0 },
      whatsapp: { type: Number, default: 0 },
      dashboard: { type: Number, default: 0 },
    },

    // 🚦 Status do ciclo
    status: {
      type: String,
      enum: ["active", "limit_reached", "blocked", "closed"],
      default: "active",
      index: true,
    },

    // 💳 Billing
    billing: {
      provider: {
        type: String,
        enum: ["mercadopago", "manual"],
      },

      subscriptionId: String,
      invoiceId: String,

      paid: {
        type: Boolean,
        default: false,
      },

      paidAt: Date,
    },

    // 🕒 Controle
    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,
  },
  {
    timestamps: true,
  }
);

// 🔐 Garantia: 1 documento por cliente por mês
UsageSchema.index(
  { clientId: 1, "period.month": 1, "period.year": 1 },
  { unique: true }
);

export default mongoose.model("Usage", UsageSchema);