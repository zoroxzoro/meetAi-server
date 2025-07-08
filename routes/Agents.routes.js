import express from "express";
import { createAgent, getAgentsByUser } from "../Controller/Agents.js";
const router = express.Router();

router.post("/createAgent", createAgent);
router.post("/getAgents", getAgentsByUser);

export default router;