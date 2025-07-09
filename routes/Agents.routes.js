import express from "express";
import { createAgent, deleteAgent, getAgentsByUser, updateAgent } from "../Controller/Agents.js";
const router = express.Router();

router.post("/createAgent", createAgent);
router.post("/getAgents", getAgentsByUser);
router.post("/update-agent", updateAgent);
router.post("/delete-agent", deleteAgent);

export default router;