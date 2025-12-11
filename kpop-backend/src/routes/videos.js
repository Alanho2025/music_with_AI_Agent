// routes/videos.js
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { pickWithGroupLimit } = require("../utils/recommendUtils");
const { verifyToken } = require("../middlewares/auth");
const { attachUser } = require("../middlewares/user");
router.get("/recommended", async (req, res) => {
    try {
        const { rows } = await db.query(
            `
        SELECT
          v.*,
          g.name AS group_name,
          -- 人氣 + 時間衰退分數
          (
            (0.7 * LN(v.views + 1) + 0.3 * v.likes) *
            EXP(
              -0.01 * GREATEST(
                EXTRACT(EPOCH FROM (NOW() - v.publish_date)) / 86400,
                0
              )
            )
          ) AS score
        FROM videos v
        LEFT JOIN groups g ON v.group_id = g.id
        WHERE v.views IS NOT NULL
          AND v.likes IS NOT NULL
        ORDER BY score DESC
        LIMIT 30
        `
        );

        // 每個 group 最多 3 支，總共 6 支
        const topVideos = pickWithGroupLimit(rows, 6, "group_id", 3);

        res.json(topVideos);
    } catch (err) {
        console.error("GET /api/videos/recommended error:", err);
        res
            .status(500)
            .json({ error: "Failed to fetch recommended videos" });
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

// GET /videos/:id/meta
router.get("/:id/meta", async (req, res) => {
    const videoId = Number(req.params.id);

    if (!Number.isInteger(videoId)) {
        return res.status(400).json({ error: "Invalid video id" });
    }

    try {
        const result = await db.query(
            `
            SELECT 
                v.id,
                v.title,
                v.views,
                v.likes,
                g.name AS group_name,
                g.company
            FROM videos v
            LEFT JOIN groups g ON v.group_id = g.id
            WHERE v.id = $1
            `,
            [videoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        const row = result.rows[0];

        res.json({
            id: row.id,
            title: row.title,
            groupName: row.group_name,
            company: row.company,
            views: row.views || 0,
            likes: row.likes || 0,
        });
    } catch (err) {
        console.error("Failed to fetch video meta", err);
        res.status(500).json({ error: "Failed to fetch video meta" });
    }
});

// GET /videos/:id/comments
router.get("/:id/comments", async (req, res) => {
    const videoId = Number(req.params.id);

    if (!Number.isInteger(videoId)) {
        return res.status(400).json({ error: "Invalid video id" });
    }

    try {
        const result = await db.query(
            `
            SELECT 
                c.id,
                c.video_id,
                c.parent_id,
                c.content,
                c.created_at,
                u.username,
                u.display_name
            FROM video_comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.video_id = $1
            ORDER BY c.created_at ASC
            `,
            [videoId]
        );

        res.json(
            result.rows.map((row) => ({
                id: row.id,
                videoId: row.video_id,
                parentId: row.parent_id,
                content: row.content,
                createdAt: row.created_at,
                authorName: row.display_name || row.username || "Unknown",
            }))
        );
    } catch (err) {
        console.error("Failed to fetch video comments", err);
        res.status(500).json({ error: "Failed to fetch video comments" });
    }
});

// POST /videos/:id/comments
// body: { content: string, parentId?: number }
router.post(
    "/:id/comments",
    verifyToken,
    attachUser,
    async (req, res) => {
        const videoId = Number(req.params.id);
        const { content, parentId } = req.body;

        if (!Number.isInteger(videoId)) {
            return res.status(400).json({ error: "Invalid video id" });
        }
        if (!content || typeof content !== "string") {
            return res.status(400).json({ error: "Content is required" });
        }

        const userId = req.user?.id; // 看你 attachUser 怎麼塞的，這邊用最常見的

        try {
            const result = await db.query(
                `
                INSERT INTO video_comments (video_id, user_id, parent_id, content)
                VALUES ($1, $2, $3, $4)
                RETURNING id, video_id, parent_id, content, created_at
                `,
                [videoId, userId || null, parentId || null, content.trim()]
            );

            const row = result.rows[0];

            res.status(201).json({
                id: row.id,
                videoId: row.video_id,
                parentId: row.parent_id,
                content: row.content,
                createdAt: row.created_at,
                authorName: req.user?.display_name || req.user?.username || "You",
            });
        } catch (err) {
            console.error("Failed to create comment", err);
            res.status(500).json({ error: "Failed to create comment" });
        }
    }
);
// GET /videos/:id/liked
router.get("/:id/liked", verifyToken, attachUser, async (req, res) => {
    const videoId = Number(req.params.id);
    const userId = req.user?.id;

    try {
        const result = await db.query(
            `SELECT 1 FROM user_video_likes WHERE user_id=$1 AND video_id=$2`,
            [userId, videoId]
        );

        res.json({ liked: result.rows.length > 0 });
    } catch (err) {
        console.error("Check liked failed", err);
        res.status(500).json({ error: "Failed to check like status" });
    }
});
// POST /videos/:id/like
router.post("/:id/like", verifyToken, attachUser, async (req, res) => {
    const videoId = Number(req.params.id);
    const userId = req.user?.id;

    try {
        // 檢查是否按過讚
        const check = await db.query(
            `SELECT 1 FROM user_video_likes WHERE user_id=$1 AND video_id=$2`,
            [userId, videoId]
        );

        if (check.rows.length > 0) {
            // 已按讚 → 取消讚
            await db.query(
                `DELETE FROM user_video_likes WHERE user_id=$1 AND video_id=$2`,
                [userId, videoId]
            );

            await db.query(
                `UPDATE videos SET likes = likes - 1 WHERE id=$1`,
                [videoId]
            );

            return res.json({ liked: false });
        } else {
            // 未按讚 → 新增讚
            await db.query(
                `INSERT INTO user_video_likes (user_id, video_id) VALUES ($1, $2)`,
                [userId, videoId]
            );

            await db.query(
                `UPDATE videos SET likes = likes + 1 WHERE id=$1`,
                [videoId]
            );

            return res.json({ liked: true });
        }
    } catch (err) {
        console.error("Failed to toggle like", err);
        res.status(500).json({ error: "Failed to toggle like" });
    }
});

module.exports = router;
