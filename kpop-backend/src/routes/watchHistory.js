const express = require("express");
const router = express.Router();
const db = require("../../db");

// Add watch history
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const { video_id, duration_seconds } = req.body;

        if (!video_id) {
            return res.status(400).json({ error: "video_id is required" });
        }

        await db.query(
            `INSERT INTO watch_history (user_id, video_id, duration_seconds)
             VALUES ($1, $2, $3)`,
            [userId, video_id, duration_seconds || null]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Failed to save watch history:", err);
        res.status(500).json({ error: "Failed to save watch history" });
    }
});



module.exports = router;
