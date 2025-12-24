import mongoose from "mongoose";

const VectorSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  source: {
    type: String,
    default: "site", // site | pdf | faq | manual
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Vector", VectorSchema);