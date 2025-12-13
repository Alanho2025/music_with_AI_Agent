const express = require("express");
const router = express.Router();
const db = require("../../db");
const { verifyToken } = require("../middlewares/auth");
const { attachUser } = require("../middlewares/user");

// GET all idols
router.get("/", async (req, res) => {
    try {
        const result = await db.query(`
      SELECT i.*, g.name AS group_name
      FROM idols i
      JOIN groups g ON i.group_id = g.id
      ORDER BY i.id ASC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch kpop female idols");
    }
});
router.get("/featured", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT 
                i.*,
                g.name AS group_name
            FROM idols i
            JOIN groups g ON i.group_id = g.id
            ORDER BY RANDOM()
            LIMIT 3
            `
        );

        if (result.rows.length === 0) {
            return res.json(null);
        }

        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/idols/featured error:", err);
        res.status(500).json({ error: "Failed to fetch featured idol" });
    }
});



// 取得目前使用者有沒有訂閱這個 idol
router.get("/:id/subscription", verifyToken, attachUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: idolId } = req.params;

        const result = await db.query(
            `SELECT notify 
             FROM idols_subscriptions 
             WHERE user_id = $1 AND idol_id = $2`,
            [userId, idolId]
        );

        res.json({
            subscribed: result.rows.length > 0,
            notify: result.rows[0]?.notify ?? false
        });
    } catch (err) {
        console.error("GET /api/idols/:id/subscription error:", err);
        res.status(500).json({ error: "Failed to fetch subscription" });
    }
});

// 訂閱
router.post("/:id/subscribe", verifyToken, attachUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: idolId } = req.params;

        await db.query(
            `INSERT INTO idols_subscriptions (user_id, idol_id, notify)
             VALUES ($1, $2, TRUE)
             ON CONFLICT (user_id, idol_id)
             DO UPDATE SET notify = TRUE`,   // 如果已存在就恢復通知
            [userId, idolId]
        );

        res.status(201).json({ subscribed: true, notify: true });
    } catch (err) {
        console.error("POST /api/idols/:id/subscribe error:", err);
        res.status(500).json({ error: "Failed to subscribe" });
    }
});

// 取消訂閱
router.delete("/:id/subscribe", verifyToken, attachUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: idolId } = req.params;

        await db.query(
            `DELETE FROM idols_subscriptions
             WHERE user_id = $1 AND idol_id = $2`,
            [userId, idolId]
        );

        res.json({ subscribed: false });
    } catch (err) {
        console.error("DELETE /api/idols/:id/subscribe error:", err);
        res.status(500).json({ error: "Failed to unsubscribe" });
    }
});

// GET single idol with images
router.get("/:idolId", async (req, res) => {
    const { idolId } = req.params;

    try {
        // 1) 單筆 idol
        const idolResult = await db.query(
            `
            SELECT i.*, g.name AS group_name
            FROM idols i
            LEFT JOIN groups g ON g.id = i.group_id
            WHERE i.id = $1
            `,
            [idolId]
        );

        if (idolResult.rows.length === 0) {
            return res.status(404).json({ error: "Idol not found" });
        }
        const idol = idolResult.rows[0];

        // 2) 多張圖片
        const imagesResult = await db.query(
            `
            SELECT id, image_url, sort_order
            FROM idol_images
            WHERE idol_id = $1
            ORDER BY sort_order ASC, id ASC
            `,
            [idolId]
        );

        const images = imagesResult.rows;

        // 3) 回傳給前端
        res.json({
            idol,
            images,
        });
    } catch (err) {
        console.error("GET /api/idols/:idolId error:", err);
        res.status(500).json({ error: "Failed to fetch idol detail" });
    }
});
  
module.exports = router;