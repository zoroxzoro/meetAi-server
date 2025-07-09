import Agent from "../model/Agents.model.js"; // adjust path as needed
import User from "../model/User.model.js";

// Create a new agent
export const createAgent = async (req, res) => {
    try {
        const { name, instruction } = req.body;
        console.log(req.body);

        const userId = req.body.user
        console.log(userId);

        const { _id } = await User.findOne({ user_id: userId });
        console.log(_id);



        const agent = await Agent.create({
            user: _id,
            name,
            instruction
        });

        // Optional: Push agent into user.agents[]
        await User.findByIdAndUpdate(_id, {
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

export const deleteAgent = async (req, res) => {
    try {
        const { agentId, userId } = req.body;

        if (!agentId || !userId) {
            return res.status(400).json({ message: "Agent ID and User ID are required." });
        }

        const { _id: userMongoId } = await User.findOne({ user_id: userId });

        // Remove agent from User.agents array
        await User.findByIdAndUpdate(userMongoId, {
            $pull: { agents: agentId }
        });

        // Delete the agent
        await Agent.findByIdAndDelete(agentId);

        res.status(200).json({ message: "Agent deleted successfully." });
    } catch (error) {
        console.error("Delete Agent Error:", error);
        res.status(500).json({ message: "Failed to delete agent." });
    }
};

// Update an agent
export const updateAgent = async (req, res) => {
    try {
        const { agentId, name, instruction } = req.body;

        if (!agentId || (!name && !instruction)) {
            return res.status(400).json({ message: "Agent ID and at least one field to update are required." });
        }

        const updatedAgent = await Agent.findByIdAndUpdate(
            agentId,
            { $set: { ...(name && { name }), ...(instruction && { instruction }) } },
            { new: true }
        );

        res.status(200).json(updatedAgent);
    } catch (error) {
        console.error("Update Agent Error:", error);
        res.status(500).json({ message: "Failed to update agent." });
    }
};

