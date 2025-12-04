// kpop-backend/src/routes/playlists.js
const express = require("express");
const router = express.Router();
const db = require("../../db");

// 小工具：之後可以換成從 auth 拿 user id
function getUserId(req) {
    // 將來如果有 users table，可以在這裡用 req.auth 去查對應的 internal user id
    if (req.auth && req.auth.sub) {
        // console.log("Keycloak user sub:", req.auth.sub);
        // TODO: 用 req.auth.sub 去查自己的 users table
    }

    // 目前先用固定的 demo user
    return 1;
}

// GET /api/playlists
// 取得某個使用者的所有 playlists（不含 items，只要 meta）
router.get("/", async (req, res) => {
    try {
        const userId = getUserId(req);

        const result = await db.query(
            `
            SELECT id, user_id, name, created_at
            FROM playlists
            WHERE user_id = $1
            ORDER BY created_at DESC, id DESC
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/playlists error:", err);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// GET /api/playlists/:id
// playlist meta + items + video 資訊
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const playlistResult = await db.query(
            `
            SELECT id, user_id, name, created_at
            FROM playlists
            WHERE id = $1
            `,
            [id]
        );

        if (playlistResult.rows.length === 0) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        const playlist = playlistResult.rows[0];

        const itemsResult = await db.query(
            `
            SELECT
                pi.id,
                pi.video_id,
                pi.sort_order,
                v.title,
                v.youtube_id,
                v.category,
                v.group_id,
                g.name AS group_name
            FROM playlist_items pi
            JOIN videos v ON pi.video_id = v.id
            LEFT JOIN groups g ON v.group_id = g.id
            WHERE pi.playlist_id = $1
            ORDER BY pi.sort_order ASC, pi.id ASC
            `,
            [id]
        );

        res.json({
            ...playlist,
            items: itemsResult.rows,
        });
    } catch (err) {
        console.error("GET /api/playlists/:id error:", err);
        res.status(500).json({ error: "Failed to fetch playlist" });
    }
});

// POST /api/playlists
// body: { name, video_ids: [1,2,3] }
router.post("/", async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, video_ids } = req.body || {};

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Playlist name is required" });
        }

        const cleanName = name.trim();
        const ids = Array.isArray(video_ids) ? video_ids : [];

        const playlistResult = await db.query(
            `
            INSERT INTO playlists (user_id, name)
            VALUES ($1, $2)
            RETURNING id, user_id, name, created_at
            `,
            [userId, cleanName]
        );

        const playlist = playlistResult.rows[0];

        if (ids.length > 0) {
            const values = [];
            const params = [];
            ids.forEach((videoId, index) => {
                params.push(playlist.id, videoId, index + 1);
                const offset = index * 3;
                values.push(
                    `($${offset + 1}, $${offset + 2}, $${offset + 3})`
                );
            });

            await db.query(
                `
                INSERT INTO playlist_items (playlist_id, video_id, sort_order)
                VALUES ${values.join(", ")}
                `,
                params
            );
        }

        res.status(201).json(playlist);
    } catch (err) {
        console.error("POST /api/playlists error:", err);
        res.status(500).json({ error: "Failed to create playlist" });
    }
});

// PUT /api/playlists/:id
// body: { name, video_ids: [1,2,3] }
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, video_ids } = req.body || {};

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Playlist name is required" });
        }

        const cleanName = name.trim();
        const ids = Array.isArray(video_ids) ? video_ids : [];

        // 更新名稱
        const updateResult = await db.query(
            `
            UPDATE playlists
            SET name = $1
            WHERE id = $2
            RETURNING id, user_id, name, created_at
            `,
            [cleanName, id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        const playlist = updateResult.rows[0];

        // 先清掉舊的 items，再重建
        await db.query(
            "DELETE FROM playlist_items WHERE playlist_id = $1",
            [id]
        );

        if (ids.length > 0) {
            const values = [];
            const params = [];
            ids.forEach((videoId, index) => {
                params.push(id, videoId, index + 1);
                const offset = index * 3;
                values.push(
                    `($${offset + 1}, $${offset + 2}, $${offset + 3})`
                );
            });

            await db.query(
                `
                INSERT INTO playlist_items (playlist_id, video_id, sort_order)
                VALUES ${values.join(", ")}
                `,
                params
            );
        }

        res.json(playlist);
    } catch (err) {
        console.error("PUT /api/playlists/:id error:", err);
        res.status(500).json({ error: "Failed to update playlist" });
    }
});

module.exports = router;
