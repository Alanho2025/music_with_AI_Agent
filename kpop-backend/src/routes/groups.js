const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET all groups
// GET /api/groups  取得所有 group（給 Groups.jsx 用）
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, debut_date 
         FROM groups
         ORDER BY debut_date ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch groups list", err);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
});
  
// GET group albums (timeline)
router.get("/:groupId/albums", async (req, res) => {
    const { groupId } = req.params;

    try {
        // get group info first (for debut)
        const groupResult = await db.query(
            `SELECT id, name, debut_date FROM groups WHERE id = $1`,
            [groupId]
        );

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: "Group not found" });
        }

        const group = groupResult.rows[0];

        // get albums
        const albumsResult = await db.query(
            `SELECT id, title, release_date, img_url, sales, peak_chart
         FROM albums
         WHERE group_id = $1
         ORDER BY release_date ASC`,
            [groupId]
        );

        // add debut node manually as "virtual album"
        const debutNode = {
            id: `debut-${group.id}`,
            title: `${group.name} Debut`,
            release_date: group.debut_date,
            img_url: null,  // debut 沒封面
            is_debut: true
        };

        res.json([debutNode, ...albumsResult.rows]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load albums" });
    }
});

module.exports = router;