// routes/playlists.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// 取得目前登入使用者的播放清單
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id; // 這是 users table 的 id

        const result = await db.query(
            "SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/playlists error:", err);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// 新增一個播放清單
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        const result = await db.query(
            `INSERT INTO playlists (user_id, name)
       VALUES ($1, $2)
       RETURNING *`,
            [userId, name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST /api/playlists error:", err);
        res.status(500).json({ error: "Failed to create playlist" });
    }
});

module.exports = router;
