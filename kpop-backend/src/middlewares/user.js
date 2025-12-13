// src/middlewares/user.js
const db = require("../../db");

async function attachUser(req, res, next) {
    try {
        if (!req.auth || !req.auth.sub) {
            req.user = null;
            return next();
        }

        const keycloakId = req.auth.sub;
        const username = req.auth.preferred_username || null;
        const displayName = req.auth.name || null;

        // 1. 查 users table 看有沒有對應 keycloak_id
        const existRes = await db.query(
            `SELECT id, keycloak_id, username, display_name, nickname, bio, timezone, language,
              hero_background, hero_background_pos_x, hero_background_pos_y
       FROM users
       WHERE keycloak_id = $1`,
            [keycloakId]
        );

        if (existRes.rows.length > 0) {
            req.user = existRes.rows[0];
            return next();
        }

        // 2. 如果沒有 → 自動新增一筆 user
        const insertRes = await db.query(
            `INSERT INTO users (keycloak_id, username, display_name, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, keycloak_id, username, display_name,
                 nickname, bio, timezone, language,
                 hero_background, hero_background_pos_x, hero_background_pos_y`,
            [keycloakId, username, displayName]
        );

        req.user = insertRes.rows[0];
        return next();
    } catch (err) {
        console.error("attachUser error:", err);
        req.user = null;
        return next();
    }
}

module.exports = { attachUser };
