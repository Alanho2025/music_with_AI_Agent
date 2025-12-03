// routes/playlists.js
const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/playlists
// 取得目前登入使用者所有 playlists
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT id, user_id, name, created_at
       FROM playlists
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/playlists error:", err);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// POST /api/playlists
// 建一個新的 playlist
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const result = await db.query(
            `INSERT INTO playlists (user_id, name)
       VALUES ($1, $2)
       RETURNING id, user_id, name, created_at`,
            [userId, name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST /api/playlists error:", err);
        res.status(500).json({ error: "Failed to create playlist" });
    }
});

// GET /api/playlists/:id/items
// 拿到某個 playlist 的影片列表（包含 video 資訊）
router.get("/:id/items", async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        // 先確認這個 playlist 是這個 user 的
        const playlistResult = await db.query(
            `SELECT id, user_id, name
       FROM playlists
       WHERE id = $1`,
            [playlistId]
        );

        if (playlistResult.rows.length === 0) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        if (playlistResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: "Not allowed to access this playlist" });
        }

        // 撈 playlist_items + videos
        const itemsResult = await db.query(
            `SELECT
         pi.id AS playlist_item_id,
         pi.sort_order,
         v.id AS video_id,
         v.title,
         v.youtube_id,
         v.category,
         v.thumbnail_url
       FROM playlist_items pi
       JOIN videos v ON pi.video_id = v.id
       WHERE pi.playlist_id = $1
       ORDER BY pi.sort_order ASC, pi.id ASC`,
            [playlistId]
        );

        res.json({
            playlist: playlistResult.rows[0],
            items: itemsResult.rows,
        });
    } catch (err) {
        console.error("GET /api/playlists/:id/items error:", err);
        res.status(500).json({ error: "Failed to fetch playlist items" });
    }
});

module.exports = router;
