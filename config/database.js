import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro MongoDB", err);
    process.exit(1);
  }
}
