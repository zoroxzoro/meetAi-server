import express from "express";
import User from "../model/User.model.js";

const router = express.Router();

router.post("/webhooks/clerk", express.json(), async (req, res) => {
    try {
        const event = req.body;

        if (!event || !event.type || !event.data) {
            return res.status(400).send("Invalid payload");
        }

        const userData = event.data;
        const clerkId = userData.id;

        // Extract email
        const emailObj = userData.email_addresses?.[0];
        const email = emailObj?.email_address || null;

        // Check if email is verified
        const emailVerified =
            emailObj?.verification?.status === "verified" ? new Date() : null;

        // Extract full name
        const fullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();

        // Prefer high-quality image (OAuth) if available
        const externalImage = userData.external_accounts?.[0]?.picture;
        const image = externalImage || userData.image_url || userData.profile_image_url;

        const password = "clerk-oauth"; // placeholder

        if (event.type === "user.created" || event.type === "user.updated") {
            const updatedUser = await User.findOneAndUpdate(
                { user_id: clerkId },
                {
                    user_id: clerkId,
                    name: fullName,
                    email,
                    password,
                    image,
                    emailVerified,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log("✅ User upserted:", updatedUser);
        }

        if (event.type === "user.deleted") {
            await User.deleteOne({ user_id: clerkId });
            console.log("❌ User deleted from DB");
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error("❌ Error in webhook handler:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
