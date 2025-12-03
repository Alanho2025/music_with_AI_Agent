// routes/adminVideos.js
const express = require("express");
const axios = require("axios");
const db = require("../../db");

const router = express.Router();

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

// --------- Helpers ---------
function extractYoutubeId(input) {
    if (!input) return null;

    // already plain ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
    }

    try {
        const url = new URL(input);

        if (url.searchParams.get("v")) {
            // https://www.youtube.com/watch?v=xxxx
            return url.searchParams.get("v");
        }

        if (url.hostname.includes("youtu.be")) {
            // https://youtu.be/xxxx
            return url.pathname.replace("/", "");
        }
    } catch (e) {
        // not a URL, fall through
    }

    return null;
}

function parseDurationToSeconds(duration) {
    // ISO 8601 PT#H#M#S
    const match = duration?.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );
    if (!match) return null;

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds;
}

// --------- 1. Fetch metadata from YouTube ---------
router.post("/fetch-youtube", async (req, res) => {
    try {
        if (!YT_API_KEY) {
            return res
                .status(500)
                .json({ error: "YouTube API key is not configured" });
        }

        const { youtubeUrl } = req.body;
        const videoId = extractYoutubeId(youtubeUrl);

        if (!videoId) {
            return res
                .status(400)
                .json({ error: "Invalid YouTube URL or ID" });
        }

        const ytRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet,contentDetails,statistics",
                    id: videoId,
                    key: YT_API_KEY,
                },
            }
        );

        if (!ytRes.data.items || ytRes.data.items.length === 0) {
            return res
                .status(404)
                .json({ error: "YouTube video not found" });
        }

        const item = ytRes.data.items[0];
        const snippet = item.snippet || {};
        const stats = item.statistics || {};
        const contentDetails = item.contentDetails || {};

        const durationSeconds = contentDetails.duration
            ? parseDurationToSeconds(contentDetails.duration)
            : null;

        const response = {
            youtube_id: videoId,
            title: snippet.title || "",
            description: snippet.description || "",
            publish_date: snippet.publishedAt || null,
            channel_title: snippet.channelTitle || "",
            thumbnail_url:
                (snippet.thumbnails &&
                    (snippet.thumbnails.maxres ||
                        snippet.thumbnails.high ||
                        snippet.thumbnails.medium ||
                        snippet.thumbnails.default)?.url) ||
                null,
            tags: snippet.tags || [],
            views: stats.viewCount ? parseInt(stats.viewCount, 10) : null,
            likes: stats.likeCount ? parseInt(stats.likeCount, 10) : null,
            duration_seconds: durationSeconds,
        };

        res.json(response);
    } catch (err) {
        console.error(
            "fetch-youtube error:",
            err.response?.status,
            err.response?.data || err.message || err
        );

        const status = err.response?.status || 500;
        const msg =
            err.response?.data?.error?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch YouTube metadata";

        res.status(status).json({ error: msg });
    }
});

// 共用：把 tags 轉成陣列
function normalizeTags(tags) {
    if (Array.isArray(tags)) {
        return tags;
    }
    if (typeof tags === "string" && tags.trim().length > 0) {
        return tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }
    return null;
}

// --------- 2. Create video ---------
router.post("/", async (req, res) => {
    try {
        const {
            group_id,
            title,
            youtube_id,
            category,
            tags,
            publish_date,
            thumbnail_url,
            description,
            mood,
            style,
            era,
            duration_seconds,
            views,
            likes,
        } = req.body;

        if (!title || !youtube_id) {
            return res
                .status(400)
                .json({ error: "title and youtube_id are required" });
        }

        const tagsArray = normalizeTags(tags);

        const result = await db.query(
            `INSERT INTO videos (
         group_id,
         title,
         youtube_id,
         category,
         tags,
         publish_date,
         thumbnail_url,
         description,
         mood,
         style,
         era,
         duration_seconds,
         views,
         likes
       )
       VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, $14
       )
       RETURNING *`,
            [
                group_id || null,
                title,
                youtube_id,
                category || null,
                tagsArray,
                publish_date ? new Date(publish_date) : null,
                thumbnail_url || null,
                description || null,
                mood || null,
                style || null,
                era || null,
                duration_seconds || null,
                views || null,
                likes || null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("create video error:", err);
        if (err.code === "23505") {
            return res
                .status(409)
                .json({ error: "Video with this youtube_id already exists" });
        }
        res.status(500).json({ error: "Failed to create video" });
    }
});

// --------- 3. List existing videos (for admin page) ---------
router.get("/", async (req, res) => {
    try {
        const { search, limit = 50, offset = 0 } = req.query;

        const values = [];
        let where = "";
        if (search && search.trim().length > 0) {
            values.push(`%${search.trim()}%`);
            where = `
        WHERE v.title ILIKE $1
           OR v.youtube_id ILIKE $1
           OR g.name ILIKE $1
      `;
        }

        values.push(Number(limit));
        values.push(Number(offset));

        const result = await db.query(
            `
      SELECT
        v.*,
        g.name AS group_name
      FROM videos v
      LEFT JOIN groups g ON v.group_id = g.id
      ${where}
      ORDER BY v.id DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
      `,
            values
        );

        res.json(result.rows);
    } catch (err) {
        console.error("list videos error:", err);
        res.status(500).json({ error: "Failed to list videos" });
    }
});

// --------- 4. Get single video ---------
router.get("/:id", async (req, res) => {
    try {
        const videoId = parseInt(req.params.id, 10);

        const result = await db.query(
            `
      SELECT
        v.*,
        g.name AS group_name
      FROM videos v
      LEFT JOIN groups g ON v.group_id = g.id
      WHERE v.id = $1
      `,
            [videoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("get video error:", err);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

// --------- 5. Update video ---------
router.put("/:id", async (req, res) => {
    try {
        const videoId = parseInt(req.params.id, 10);

        const {
            group_id,
            title,
            youtube_id,
            category,
            tags,
            publish_date,
            thumbnail_url,
            description,
            mood,
            style,
            era,
            duration_seconds,
            views,
            likes,
        } = req.body;

        if (!title || !youtube_id) {
            return res
                .status(400)
                .json({ error: "title and youtube_id are required" });
        }

        const tagsArray = normalizeTags(tags);

        const result = await db.query(
            `UPDATE videos
       SET
         group_id = $1,
         title = $2,
         youtube_id = $3,
         category = $4,
         tags = $5,
         publish_date = $6,
         thumbnail_url = $7,
         description = $8,
         mood = $9,
         style = $10,
         era = $11,
         duration_seconds = $12,
         views = $13,
         likes = $14
       WHERE id = $15
       RETURNING *`,
            [
                group_id || null,
                title,
                youtube_id,
                category || null,
                tagsArray,
                publish_date ? new Date(publish_date) : null,
                thumbnail_url || null,
                description || null,
                mood || null,
                style || null,
                era || null,
                duration_seconds || null,
                views || null,
                likes || null,
                videoId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("update video error:", err);
        if (err.code === "23505") {
            return res
                .status(409)
                .json({ error: "Video with this youtube_id already exists" });
        }
        res.status(500).json({ error: "Failed to update video" });
    }
});

// --------- 6. Delete video (and remove from playlists) ---------
router.delete("/:id", async (req, res) => {
    try {
        const videoId = parseInt(req.params.id, 10);

        // 先把 playlist_items 裡的關聯砍掉
        await db.query(
            "DELETE FROM playlist_items WHERE video_id = $1",
            [videoId]
        );

        const result = await db.query(
            "DELETE FROM videos WHERE id = $1 RETURNING *",
            [videoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("delete video error:", err);
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;
