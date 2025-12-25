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
      enum: ["mercadopago", "stripe"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    referenceId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true, // ✅ createdAt + updatedAt automáticos
  }
);

export default mongoose.model("Billing", BillingSchema);