import mongoose from "mongoose";

const VectorSchema = new mongoose.Schema({
  clientId: mongoose.Schema.Types.ObjectId,
  text: String,
  embedding: [Number]
});

export default mongoose.model("Vector", VectorSchema);

