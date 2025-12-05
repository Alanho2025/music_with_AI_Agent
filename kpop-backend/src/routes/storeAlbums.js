// src/routes/storeAlbums.js
const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/store/albums
// 回傳所有 album 基本資訊，給前端自己 filter
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT a.id,
                    a.title,
                    a.img_url,
                    a.price_nzd,
                    a.stock,
                    a.release_date,
                    g.name AS group_name
             FROM albums a
             LEFT JOIN groups g ON a.group_id = g.id
             ORDER BY g.name ASC NULLS LAST,
                      a.release_date DESC NULLS LAST,
                      a.title ASC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch store albums", err);
        res.status(500).json({ error: "Failed to fetch store albums" });
    }
});

module.exports = router;
