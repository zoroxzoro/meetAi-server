import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Date,
    },
    agents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    }]

});

const User = mongoose.model("User", UserSchema);

export default User