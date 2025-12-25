import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    gateway: {
      type: String,
      enum: ["mercadopago", "paypal"], // ✅ Stripe removido
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      index: true,
    },

    referenceId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Billing", BillingSchema);