// middlewares/user.js
const db = require("../../db");

// 確保 DB 裡有這個 user，沒有就建立
async function attachUser(req, res, next) {
    try {
        if (!req.auth) {
            return res.status(500).json({ error: "Auth info missing on request" });
        }

        const keycloakId = req.auth.sub; // Keycloak 的 subject

        // 從 token 裡組一個 display_name
        const displayName =
            req.auth.name ||
            req.auth.preferred_username ||
            req.auth.email ||
            "Unknown user";

        // 1. 先查 users table
        const existing = await db.query(
            "SELECT * FROM users WHERE keycloak_id = $1",
            [keycloakId]
        );

        let userRow;

        if (existing.rows.length === 0) {
            // 2. 找不到就 INSERT 一筆
            const inserted = await db.query(
                `INSERT INTO users (keycloak_id, display_name)
         VALUES ($1, $2)
         RETURNING *`,
                [keycloakId, displayName]
            );
            userRow = inserted.rows[0];
        } else {
            userRow = existing.rows[0];
        }

        // 3. 把 user 放在 req.user，之後 route 可以用
        req.user = userRow;
        next();
    } catch (err) {
        console.error("attachUser error:", err);
        res.status(500).json({ error: "Failed to attach user" });
    }
}

module.exports = {
    attachUser,
};
