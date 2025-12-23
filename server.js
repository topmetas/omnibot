import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.routes.js";



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 3000;


app.listen(process.env.PORT, () => {
  console.log("🚀 Servidor rodando na porta", process.env.PORT);
});
