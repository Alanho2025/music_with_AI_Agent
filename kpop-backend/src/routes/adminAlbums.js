const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET /api/admin/albums  列出所有 albums
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
              g.name AS group_name
       FROM albums a
       JOIN groups g ON a.group_id = g.id
       ORDER BY g.name ASC, a.release_date ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch albums list", err);
        res.status(500).json({ error: "Failed to fetch albums list" });
    }
});

// GET /api/admin/albums/:id  單一 album
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT id, group_id, title, release_date, country, sales, peak_chart, img_url
       FROM albums
       WHERE id = $1`,
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

// PUT /api/admin/albums/:id  更新 album
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        group_id,
        title,
        release_date,
        country,
        sales,
        peak_chart,
        img_url,
    } = req.body.album || req.body;

    try {
        await db.query(
            `UPDATE albums
       SET group_id = $1,
           title = $2,
           release_date = $3,
           country = $4,
           sales = $5,
           peak_chart = $6,
           img_url = $7
       WHERE id = $8`,
            [group_id, title, release_date, country, sales, peak_chart, img_url, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Failed to update album", err);
        res.status(500).json({ error: "Failed to update album" });
    }
});

module.exports = router;
