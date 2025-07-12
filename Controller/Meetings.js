// controllers/meetingController.js

import Meeting from "../model/meetings.model.js";
import Agent from "../model/Agents.model.js";
import User from "../model/User.model.js";

// POST /api/meetings/create
export const createMeeting = async (req, res) => {
    try {
        const { title, agent, userId } = req.body;
        const user = await User.findOne({ user_id: userId });
        console.log("userid", user);


        // Validation
        if (!title || !agent || !userId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check agent exists
        const existingAgent = await Agent.findById(agent);
        if (!existingAgent) {
            return res.status(404).json({ message: "Agent not found." });
        }

        // Create meeting
        const newMeeting = await Meeting.create({
            name: title,
            agent,
            user: user._id,
        });

        res.status(201).json({
            message: "Meeting created successfully",
            meeting: newMeeting,
        });
    } catch (err) {
        console.error("Create Meeting Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};



export const getMeetingsByUser = async (req, res) => {
    try {
        const { userId } = req.body; // use ?clerkId=xyz

        if (!userId) {
            return res.status(400).json({ message: "Clerk user ID is required." });
        }

        // Get the actual MongoDB user document
        const user = await User.findOne({ user_id: userId }).populate("agents");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Now fetch all meetings for this user._id
        const meetings = await Meeting.find({ user: user._id })
            .populate("agent", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ meetings });
    } catch (error) {
        console.error("Get meetings error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

