// routes/videos.js
const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/videos?group_id=1
router.get("/", async (req, res) => {
    try {
        const { group_id } = req.query;

        let result;
        if (group_id) {
            result = await db.query(
                `SELECT v.*
         FROM videos v
         WHERE v.group_id = $1
         ORDER BY v.id`,
                [group_id]
            );
        } else {
            result = await db.query(
                `SELECT v.*
         FROM videos v
         ORDER BY v.id`
            );
        }

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/videos error:", err);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// (選配) 單一影片
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            "SELECT * FROM videos WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("GET /api/videos/:id error:", err);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

module.exports = router;
