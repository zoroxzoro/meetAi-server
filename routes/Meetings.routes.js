

import express from "express";
import { createMeeting, getMeetingsByUser } from "../Controller/Meetings.js";

const router = express.Router();

// @route   POST /api/meetings/create
router.post("/create", createMeeting);
router.post("/get", getMeetingsByUser);

export default router;
