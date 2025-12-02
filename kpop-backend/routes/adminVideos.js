// routes/adminVideos.js
const express = require("express");
const axios = require("axios");
const db = require("../db");

const router = express.Router();

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

function extractYoutubeId(input) {
    if (!input) return null;

    // 已經是純 ID 的情況
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
    }

    try {
        const url = new URL(input);
        // https://www.youtube.com/watch?v=xxxx
        if (url.searchParams.get("v")) {
            return url.searchParams.get("v");
        }
        // https://youtu.be/xxxx
        if (url.hostname.includes("youtu.be")) {
            return url.pathname.replace("/", "");
        }
    } catch {
        // 不是合法 URL，當作錯誤處理
    }

    return null;
}

function parseDurationToSeconds(duration) {
    // ISO 8601: PT3M40S
    const match = duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );
    if (!match) return null;

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * POST /api/admin/videos/fetch-youtube
 * Body: { youtubeUrl: "https://www.youtube.com/watch?v=..." }
 * 回傳：從 YouTube Data API 抓到的 metadata
 */
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
            return res.status(400).json({ error: "Invalid YouTube URL or ID" });
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
            return res.status(404).json({ error: "YouTube video not found" });
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
            err.response?.data?.error?.message ||   // 有些 Google API 會長這樣
            err.response?.data?.error ||           // 我們自己回的 { error: ... }
            err.message ||
            "Failed to fetch YouTube metadata";

        res.status(status).json({ error: msg });
       }
});

/**
 * POST /api/admin/videos
 * 新增影片到資料庫
 * Body: {
 *   group_id,
 *   title,
 *   youtube_id,
 *   category,
 *   tags,            // string[] 或 comma-separated string
 *   publish_date,
 *   thumbnail_url,
 *   description,
 *   mood,
 *   style,
 *   era,
 *   duration_seconds,
 *   views,
 *   likes
 * }
 */
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

        let tagsArray = null;
        if (Array.isArray(tags)) {
            tagsArray = tags;
        } else if (typeof tags === "string" && tags.trim().length > 0) {
            tagsArray = tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
        }

        const result = await db.query(
            `INSERT INTO videos
       (
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
       VALUES
       (
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
            // unique violation on youtube_id
            return res
                .status(409)
                .json({ error: "Video with this youtube_id already exists" });
        }
        res.status(500).json({ error: "Failed to create video" });
    }
});

module.exports = router;
