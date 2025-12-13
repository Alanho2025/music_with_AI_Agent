const express = require("express");
const router = express.Router();
const db = require("../../db");
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
// ------------------------------
// 1. GET Profile + Stats
// ------------------------------
// GET /api/users/profile
router.get("/profile", async (req, res) => {
    try {
        const userId = req.user.id;

        const profileRes = await db.query(
            `SELECT 
            id,
            username,
            display_name,
            nickname,
            bio,
            timezone,
            language,
            hero_background,
            hero_background_pos_x,
            hero_background_pos_y,
            avatar_url,
            email
         FROM users
         WHERE id = $1`,
            [userId]
        );

        const statsRes = await db.query(
            `SELECT 
            (SELECT COUNT(*) FROM watch_history WHERE user_id = $1) AS watch_count,
            (SELECT COUNT(*) FROM idol_subscriptions WHERE user_id = $1) AS idol_follow_count,
            (SELECT COUNT(*) FROM user_follow_groups WHERE user_id = $1) AS group_follow_count,
            (SELECT COUNT(*) FROM playlists WHERE user_id = $1) AS playlist_count`,
            [userId]
        );

        const row = profileRes.rows[0];

        const profile = {
            id: row.id,
            username: row.username,
            email: row.email,                       
            display_name: row.display_name,
            nickname: row.nickname,
            bio: row.bio,
            timezone: row.timezone,
            language: row.language,
            hero_background: row.hero_background,
            hero_background_pos_x: row.hero_background_pos_x,
            hero_background_pos_y: row.hero_background_pos_y,
            avatar_url: row.avatar_url,
        };

        res.json({ profile, stats: statsRes.rows[0] });
    } catch (err) {
        console.error("GET /users/profile error", err);
        res.status(500).json({ error: "Failed to load profile" });
    }
});
  

// ------------------------------
// 2. UPDATE Profile
// ------------------------------
router.put("/profile", async (req, res) => {
    const userId = req.user.id;
    const { nickname, bio, timezone, language } = req.body;

    await db.query(
        `UPDATE users
         SET nickname = $1, bio = $2, timezone = $3, language = $4
         WHERE id = $5`,
        [nickname, bio, timezone, language, userId]
    );

    res.json({ success: true });
});
// ------------------------------
// 3. GET Watch History
// ------------------------------
router.get("/watch-history", async (req, res) => {
    try {
        const { days, group_id, idol_id } = req.query;
        const userId = req.user.id;

        let filter = "WHERE wh.user_id = $1";
        const params = [userId];
        let idx = 2;

        // days 避免 SQL injection，轉成 int 再當參數
        if (days) {
            const daysInt = parseInt(days, 10);
            if (!Number.isNaN(daysInt) && daysInt > 0) {
                filter += ` AND wh.watched_at >= NOW() - $${idx} * INTERVAL '1 day'`;
                params.push(daysInt);
                idx++;
            }
        }

        if (group_id) {
            filter += ` AND v.group_id = $${idx}`;
            params.push(group_id);
            idx++;
        }

        if (idol_id) {
            filter += ` AND v.idol_id = $${idx}`;
            params.push(idol_id);
            idx++;
        }

        const result = await db.query(
            `
            SELECT
                wh.id,
                wh.watched_at,
                wh.duration_seconds,
                v.id         AS video_id,
                v.title,
                v.thumbnail_url,
                v.youtube_id,
                v.group_id
            FROM watch_history wh
            JOIN videos v ON v.id = wh.video_id
            ${filter}
            ORDER BY wh.watched_at DESC
            `,
            params
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /users/watch-history error", err);
        res.status(500).json({ error: "Failed to load watch history" });
    }
});
  
// DELETE single record
router.delete("/watch-history/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await db.query(
            `DELETE FROM watch_history WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /users/watch-history/:id error", err);
        res.status(500).json({ error: "Failed to delete watch history" });
    }
});
// ------------------------------
// 4. Search History
// ------------------------------
router.get("/search-history", async (req, res) => {
    const userId = req.user.id;

    const result = await db.query(`
        SELECT * FROM search_history 
        WHERE user_id = $1
        ORDER BY searched_at DESC
        LIMIT 50
    `, [userId]);

    res.json(result.rows);
});
// DELETE all search history
router.delete("/search-history", async (req, res) => {
    const userId = req.auth.sub;
    await db.query(`DELETE FROM search_history WHERE user_id = $1`, [userId]);
    res.json({ success: true });
});
// ------------------------------
// 5. GET Preferences
// ------------------------------
router.get("/preferences", async (req, res) => {
    try {
        const userId = req.user.id;

        const prefsRes = await db.query(
            `SELECT * FROM user_preferences WHERE user_id = $1`,
            [userId]
        );

        if (prefsRes.rows.length === 0) {
            return res.json({
                user_id: userId,
                home_banner_mode: "latest",
                pref_girl_group: false,
                pref_boy_group: false,
                pref_solo: false,
                pref_gen3: false,
                pref_gen4: false,
                notif_new_album: true,
                notif_new_mv: true,
                notif_playlist_update: true,
            });
        }

        res.json(prefsRes.rows[0]);
    } catch (err) {
        console.error("GET /users/preferences error", err);
        res.status(500).json({ error: "Failed to load preferences" });
    }
});

router.put("/preferences", async (req, res) => {
    try {
        const userId = await getOrCreateUserId(req);
        const p = req.body;

        await db.query(
            `INSERT INTO user_preferences (
          user_id, home_banner_mode,
          pref_girl_group, pref_boy_group, pref_solo, pref_gen3, pref_gen4,
          notif_new_album, notif_new_mv, notif_playlist_update
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
          home_banner_mode = EXCLUDED.home_banner_mode,
          pref_girl_group = EXCLUDED.pref_girl_group,
          pref_boy_group = EXCLUDED.pref_boy_group,
          pref_solo = EXCLUDED.pref_solo,
          pref_gen3 = EXCLUDED.pref_gen3,
          pref_gen4 = EXCLUDED.pref_gen4,
          notif_new_album = EXCLUDED.notif_new_album,
          notif_new_mv = EXCLUDED.notif_new_mv,
          notif_playlist_update = EXCLUDED.notif_playlist_update
        `,
            [
                userId,
                p.home_banner_mode,
                p.pref_girl_group,
                p.pref_boy_group,
                p.pref_solo,
                p.pref_gen3,
                p.pref_gen4,
                p.notif_new_album,
                p.notif_new_mv,
                p.notif_playlist_update,
            ]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("PUT /users/preferences error", err);
        res.status(500).json({ error: "Failed to save preferences" });
    }
});
  
// ------------------------------
// 6. Subscriptions
// ------------------------------
router.get("/subscriptions", async (req, res) => {
    try {
        const userId = req.user.id;

        res.json({
            idols: [],
            groups: [],
            albums: [],
            playlists: [],
        });
    } catch (err) {
        console.error("GET /users/subscriptions error", err);
        res.status(500).json({ error: "Failed to load subscriptions" });
    }
});
// GET /users/follow-groups
router.get("/follow-groups", async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT group_id, notify
             FROM user_follow_groups
             WHERE user_id = $1`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("GET /users/follow-groups error", err);
        res.status(500).json({ error: "Failed to load follow groups" });
    }
});

// POST /users/follow-groups  (follow or update notify)
router.post("/follow-groups", async (req, res) => {
    try {
        const userId = req.user.id;
        const { group_id, notify } = req.body;

        if (!group_id) {
            return res.status(400).json({ error: "group_id is required" });
        }

        await db.query(
            `
            INSERT INTO user_follow_groups (user_id, group_id, notify)
            VALUES ($1, $2, COALESCE($3, TRUE))
            ON CONFLICT (user_id, group_id)
            DO UPDATE SET notify = EXCLUDED.notify
            `,
            [userId, group_id, notify]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("POST /users/follow-groups error", err);
        res.status(500).json({ error: "Failed to follow group" });
    }
});

// DELETE /users/follow-groups/:groupId  (unfollow)
router.delete(
    "/follow-groups/:groupId",
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { groupId } = req.params;

            await db.query(
                `DELETE FROM user_follow_groups 
                 WHERE user_id = $1 AND group_id = $2`,
                [userId, groupId]
            );

            res.json({ success: true });
        } catch (err) {
            console.error("DELETE /users/follow-groups/:groupId error", err);
            res.status(500).json({ error: "Failed to unfollow group" });
        }
    }
);

module.exports = router;