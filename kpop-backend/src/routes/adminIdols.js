// routes/adminIdols.js
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { verifyToken } = require("../middlewares/auth");
// 你之前 playlists 用的 getUserId 可以共用，不再重複寫

// GET /api/admin/idols
router.get("/", verifyToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT i.*, g.name AS group_name
             FROM idols i
             LEFT JOIN groups g ON i.group_id = g.id
             ORDER BY g.name, i.stage_name`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/admin/idols error:", err);
        res.status(500).json({ error: "Failed to fetch idols" });
    }
});
// GET /api/admin/idols/:id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const idolResult = await db.query(
            `SELECT i.*, g.name AS group_name
             FROM idols i
             LEFT JOIN groups g ON i.group_id = g.id
             WHERE i.id = $1`,
            [id]
        );
        if (idolResult.rows.length === 0) {
            return res.status(404).json({ error: "Idol not found" });
        }

        const imagesResult = await db.query(
            `SELECT id, image_url, sort_order
             FROM idol_images
             WHERE idol_id = $1
             ORDER BY sort_order, id`,
            [id]
        );

        res.json({
            idol: idolResult.rows[0],
            images: imagesResult.rows,
        });
    } catch (err) {
        console.error("GET /api/admin/idols/:id error:", err);
        res.status(500).json({ error: "Failed to fetch idol" });
    }
});
// PUT /api/admin/idols/:id
router.put("/:id", verifyToken, async (req, res) => {
    const client = await db.connect();
    try {
        const { id } = req.params;
        const { idol, images } = req.body;

        await client.query("BEGIN");

        // 更新 idol 基本資料，新增 mbti / instagram
        await client.query(
            `UPDATE idols
             SET stage_name = $1,
                 birth_name = $2,
                 korean_name = $3,
                 position = $4,
                 birthdate = $5,
                 nationality = $6,
                 summary = $7,
                 image_url = $8,
                 MBTI = $9,
                 instagram = $10
             WHERE id = $11`,
            [
                idol.stage_name,
                idol.birth_name,
                idol.korean_name,
                idol.position,
                idol.birthdate,
                idol.nationality,
                idol.summary,
                idol.image_url || null,
                idol.mbti || null,
                idol.instagram || null,
                id,
            ]
        );

        // 先刪掉舊的圖片，再插入新的（原本就有）
        await client.query("DELETE FROM idol_images WHERE idol_id = $1", [id]);

        if (Array.isArray(images)) {
            for (const img of images) {
                if (!img.image_url) continue;
                await client.query(
                    `INSERT INTO idol_images (idol_id, image_url, sort_order)
                     VALUES ($1, $2, $3)`,
                    [id, img.image_url, img.sort_order ?? 0]
                );
            }
        }

        await client.query("COMMIT");
        res.json({ success: true });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("PUT /api/admin/idols/:id error:", err);
        res.status(500).json({ error: "Failed to update idol" });
    } finally {
        client.release();
    }
});

module.exports = router;