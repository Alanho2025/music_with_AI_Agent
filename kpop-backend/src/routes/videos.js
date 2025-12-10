// routes/videos.js
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { pickWithGroupLimit } = require("../utils/recommendUtils");
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

module.exports = router;
