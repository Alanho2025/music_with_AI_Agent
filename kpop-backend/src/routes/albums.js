const express = require("express");
const router = express.Router();
const db = require("../../db");

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

module.exports = router;
