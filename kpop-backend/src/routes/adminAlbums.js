const express = require("express");
const router = express.Router();
const db = require("../../db");

// 取得所有 albums
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
                    a.summary,
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
                    a.summary,
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

// 新增 album
router.post("/", async (req, res) => {
    try {
        const payload = req.body?.album || req.body || {};

        const groupId = payload.group_id ? Number(payload.group_id) : null;

        const values = {
            title: payload.title || "New album",
            releaseDate: payload.release_date || null,
            country: payload.country || "",
            sales: payload.sales === "" ? null : Number(payload.sales),
            peakChart:
                payload.peak_chart === "" ? null : Number(payload.peak_chart),
            imgUrl: payload.img_url || "",
            priceNzd:
                payload.price_nzd === "" || payload.price_nzd == null
                    ? null
                    : Number(payload.price_nzd),
            stock:
                payload.stock === "" || payload.stock == null
                    ? 0
                    : Number(payload.stock),
        };

        const insert = await db.query(
            `INSERT INTO albums
                (group_id, title, release_date, country, sales, peak_chart, img_url, price_nzd, stock)
             VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             RETURNING id`,
            [
                groupId,
                values.title,
                values.releaseDate,
                values.country,
                values.sales,
                values.peakChart,
                values.imgUrl,
                values.priceNzd,
                values.stock,
            ]
        );

        const newId = insert.rows[0].id;

        const detail = await db.query(
            `SELECT a.*, g.name AS group_name
             FROM albums a
             LEFT JOIN groups g ON a.group_id = g.id
             WHERE a.id = $1`,
            [newId]
        );

        res.status(201).json({ album: detail.rows[0] });
    } catch (err) {
        console.error("Failed to create album", err);
        res.status(500).json({ error: "Failed to create album", detail: err.message });
    }
});

// 更新 album
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body?.album || req.body || {};

        const groupId = payload.group_id ? Number(payload.group_id) : null;

        const values = {
            title: payload.title || "",
            releaseDate: payload.release_date || null,
            country: payload.country || "",
            sales: payload.sales === "" ? null : Number(payload.sales),
            peakChart:
                payload.peak_chart === "" ? null : Number(payload.peak_chart),
            imgUrl: payload.img_url || "",
            priceNzd:
                payload.price_nzd === "" || payload.price_nzd == null
                    ? null
                    : Number(payload.price_nzd),
            stock:
                payload.stock === "" || payload.stock == null
                    ? 0
                    : Number(payload.stock),
        };

        const updated = await db.query(
            `UPDATE albums
             SET group_id   = $1,
                 title      = $2,
                 release_date = $3,
                 country    = $4,
                 sales      = $5,
                 peak_chart = $6,
                 img_url    = $7,
                 price_nzd  = $8,
                 stock      = $9
             WHERE id = $10
             RETURNING id`,
            [
                groupId,
                values.title,
                values.releaseDate,
                values.country,
                values.sales,
                values.peakChart,
                values.imgUrl,
                values.priceNzd,
                values.stock,
                id,
            ]
        );

        const detail = await db.query(
            `SELECT a.*, g.name AS group_name
             FROM albums a
             LEFT JOIN groups g ON a.group_id = g.id
             WHERE a.id = $1`,
            [id]
        );

        res.json({ album: detail.rows[0] });
    } catch (err) {
        console.error("Failed to update album", err);
        res.status(500).json({ error: "Failed to update album", detail: err.message });
    }
});

module.exports = router;
