const express = require("express");
const router = express.Router();
const db = require("../db");

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

module.exports = router;