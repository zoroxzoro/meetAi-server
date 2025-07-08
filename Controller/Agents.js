import Agent from "../model/Agents.model.js"; // adjust path as needed
import User from "../model/User.model.js";

// Create a new agent
export const createAgent = async (req, res) => {
    try {
        const { name, instruction } = req.body;
        console.log(req.body);

        const userId = req.body.user
        console.log(userId);


        const agent = await Agent.create({
            user: userId,
            name,
            instruction
        });

        // Optional: Push agent into user.agents[]
        await User.findByIdAndUpdate(userId, {
            $push: { agents: agent._id }
        });

        res.status(201).json(agent);
    } catch (error) {
        console.error("Create Agent Error:", error);
        res.status(500).json({ message: "Failed to create agent." });
    }
};
// Get all agents of a user
export const getAgentsByUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required in the request body." });
        }

        const user = await User.findOne({ user_id: userId }).populate("agents");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json(user.agents);
    } catch (error) {
        console.error("Get Agents Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};
