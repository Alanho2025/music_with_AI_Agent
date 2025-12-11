const express = require("express");
const router = express.Router();
const db = require("../../db");
const { verifyToken } = require("../middlewares/auth");
// GET hero background
router.get("/me/hero-background", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT hero_background, hero_background_pos_x, hero_background_pos_y
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        const row = result.rows[0] || {};

        res.json({
            url: row.hero_background || null,
            posX: row.hero_background_pos_x ?? 50,
            posY: row.hero_background_pos_y ?? 50,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load hero background" });
    }
});

// UPDATE hero background
router.put("/me/hero-background", async (req, res) => {
    const { url, posX, posY } = req.body;

    try {
        await db.query(
            `UPDATE users
             SET hero_background = $1,
                 hero_background_pos_x = $2,
                 hero_background_pos_y = $3
             WHERE id = $4`,
            [
                url || null,
                Number.isFinite(posX) ? posX : 50,
                Number.isFinite(posY) ? posY : 50,
                req.user.id,
            ]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update hero background" });
    }
});


module.exports = router;