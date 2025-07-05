import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import webhookRouter from "./utils/Webhook.js";
import { connectDB } from "./utils/Db.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/", webhookRouter);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port:http://localhost:${PORT}`);
})