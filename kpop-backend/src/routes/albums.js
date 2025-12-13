const express = require("express");
const router = express.Router();
const db = require("../../db");
const { pickWithGroupLimit } = require("../utils/recommendUtils");
router.get("/recommended", async (req, res) => {
    try {
        const { rows } = await db.query(
            `
        SELECT
          a.*,
          g.name AS group_name,
          -- 如果 albums 有 release_date 就用，沒有就用這張專輯底下影片中最新的 publish_date
          COALESCE(a.release_date, MAX(v.publish_date)) AS release_date,
          -- 只聚合有 album_id 的 videos，NULL 會被排除
          SUM(
            0.7 * LN(v.views + 1) + 0.3 * v.likes
          ) AS popularity_raw
        FROM albums a
        JOIN groups g ON a.group_id = g.id
        JOIN videos v ON v.album_id = a.id
        WHERE v.views IS NOT NULL
          AND v.likes IS NOT NULL
        GROUP BY a.id, g.name
        `
        );

        const now = new Date();
        const lambda = 0.01;

        const scoredAlbums = rows
            .map((row) => {
                const releaseDate = row.release_date
                    ? new Date(row.release_date)
                    : now;
                const ageDays = Math.max(
                    0,
                    (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                const recencyBoost = Math.exp(-lambda * ageDays);

                const popularityRaw = Number(row.popularity_raw) || 0;
                const score = popularityRaw * recencyBoost;

                return {
                    ...row,
                    popularity_raw: popularityRaw,
                    score,
                };
            })
            .sort((a, b) => b.score - a.score);

        // 每個 group 最多 2 張，總共 4 張
        const topAlbums = pickWithGroupLimit(
            scoredAlbums,
            4,
            "group_id",
            2
        );

        res.json(topAlbums);
    } catch (err) {
        console.error("GET /api/albums/recommended error:", err);
        res
            .status(500)
            .json({ error: "Failed to fetch recommended albums" });
    }
});
// GET album tracks (videos)
router.get("/:albumId/tracks", async (req, res) => {
    const { albumId } = req.params;

    try {
        const result = await db.query(
            `SELECT id, title, youtube_id
       FROM videos
       WHERE album_id = $1
       ORDER BY id ASC`,
            [albumId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load tracks" });
    }
});

router.get("/:albumId/tracks", async (req, res) => {
    const { albumId } = req.params;

    try {
        const result = await db.query(
            `SELECT id, title, youtube_id
             FROM videos
             WHERE album_id = $1
             ORDER BY id ASC`,
            [albumId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load tracks" });
    }
});
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT a.id,
                    a.title,
                    a.release_date,
                    a.country,
                    a.sales,
                    a.peak_chart,
                    a.img_url,
                    a.group_id,
                    a.price_nzd,
                    a.stock,
                    g.name AS group_name
             FROM albums a
             LEFT JOIN groups g ON a.group_id = g.id
             ORDER BY g.name ASC NULLS LAST, a.release_date ASC NULLS LAST, a.title ASC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch albums list", err);
        res.status(500).json({ error: "Failed to fetch albums list" });
    }
});

// 取得單一 album
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT a.id,
                    a.group_id,
                    a.title,
                    a.release_date,
                    a.country,
                    a.sales,
                    a.peak_chart,
                    a.img_url,
                    a.price_nzd,
                    a.stock,
                    g.name AS group_name
             FROM albums a
             LEFT JOIN groups g ON a.group_id = g.id
             WHERE a.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Album not found" });
        }

        res.json({ album: result.rows[0] });
    } catch (err) {
        console.error("Failed to fetch album detail", err);
        res.status(500).json({ error: "Failed to fetch album detail" });
    }
});
module.exports = router;
