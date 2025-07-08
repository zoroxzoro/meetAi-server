import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Agent = mongoose.model("Agent", AgentSchema);
export default Agent;
