// middlewares/user.js
const db = require("../../db");

// 確保 DB 裡有這個 user, 沒有就建立
async function attachUser(req, res, next) {
    try {
        if (!req.auth) {
            return res.status(500).json({ error: "Auth info missing on request" });
        }

        const keycloakId = req.auth.sub; // Keycloak 的 subject
        if (!keycloakId) {
            return res.status(400).json({ error: "Token missing subject (sub)" });
        }

        // 從 token 裡組一個 display_name
        const displayName =
            req.auth.name ||
            req.auth.preferred_username ||
            req.auth.given_name ||
            req.auth.email ||
            null;

        const email = req.auth.email || null;

        // 1. 先查 DB 有沒有這個 user
        const result = await db.query(
            "SELECT * FROM users WHERE keycloak_id = $1",
            [keycloakId]
        );

        let userRow;
        if (result.rows.length === 0) {
            // 2. 沒有就建立一筆新的
            const insert = await db.query(
                `
                INSERT INTO users (keycloak_id, display_name, email)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [keycloakId, displayName, email]
            );
            userRow = insert.rows[0];
        } else {
            userRow = result.rows[0];
        }

        // 3. 把 user 放在 req.user, 之後 route 可以用
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
