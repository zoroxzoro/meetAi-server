import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/Db.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})