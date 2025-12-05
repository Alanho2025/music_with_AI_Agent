// routes/videos.js
const express = require("express");
const router = express.Router();
const db = require("../../db");
router.get("/recommended", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT 
                v.*,
                g.name AS group_name
            FROM videos v
            LEFT JOIN groups g ON v.group_id = g.id
            ORDER BY RANDOM()
            LIMIT 6
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/videos/recommended error:", err);
        res.status(500).json({ error: "Failed to fetch recommended videos" });
    }
});
// GET /api/videos?group_id=1
router.get("/", async (req, res) => {
    try {
        const { group_id } = req.query;

        const params = [];
        let whereClause = "";

        if (group_id) {
            whereClause = "WHERE v.group_id = $1";
            params.push(group_id);
        }

        const result = await db.query(
            `
            SELECT
                v.*,
                g.name AS group_name
            FROM videos v
            LEFT JOIN groups g ON v.group_id = g.id
            ${whereClause}
            ORDER BY
                COALESCE(g.name, '') ASC,
                v.title ASC,
                v.id ASC
            `,
            params
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/videos error:", err);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// 單一影片：一樣把 group_name 帶回去
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            SELECT
                v.*,
                g.name AS group_name
            FROM videos v
            LEFT JOIN groups g ON v.group_id = g.id
            WHERE v.id = $1
            `,
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
