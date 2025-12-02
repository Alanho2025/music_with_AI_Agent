const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all groups
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM groups ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch kpop girls groups");
    }
});

module.exports = router;