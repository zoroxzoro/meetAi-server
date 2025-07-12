import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["upcoming", "active", "completed", "processing", "cancelled"],
        default: "upcoming",
        required: true,
    },
    startedAt: {
        type: Date,
    },
    endedAt: {
        type: Date,
    },
    transcriptUrl: {
        type: String,
    },
    recordingUrl: {
        type: String,
    },
    summary: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model("Meeting", MeetingSchema);
