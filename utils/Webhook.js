// webhook.js
import express from "express";
import { Webhook } from "svix";
import User from "../model/User.model.js"; // adjust the path if needed
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/api/webhooks/clerk", express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}), async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return res.status(500).send("Missing Clerk webhook secret");
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(req.rawBody, req.headers);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send("Invalid webhook signature");
    }

    const eventType = evt.type;
    const data = evt.data;

    console.log(`🔔 Clerk webhook event received: ${eventType}`);

    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name } = data;

        const user = new User({
            user_id: id,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            email: email_addresses[0]?.email_address || "",
            password: "clerk", // Placeholder
        });

        try {
            await user.save();
            console.log("✅ New user saved to MongoDB");
        } catch (err) {
            console.error("❌ Error saving user:", err.message);
        }
    }

    res.status(200).send("Webhook received");
});

// ✅ Export the router
export default router;
