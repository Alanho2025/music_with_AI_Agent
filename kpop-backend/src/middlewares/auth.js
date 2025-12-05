// middlewares/auth.js
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// 這裡要對應你的 Keycloak realm 和 port
// 如果你有改 realm 名稱或 port，記得一起改
const client = jwksClient({
    jwksUri:
        "http://localhost:8081/realms/kpop-hub/protocol/openid-connect/certs",
    cache: true,
    cacheMaxEntries: 10,
    cacheMaxAge: 10 * 60 * 1000, // 10 分鐘
});

// 從 Keycloak 的 JWKS 端點拿 public key
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

// 驗證 Authorization header 裡的 Bearer token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.slice("Bearer ".length);

    jwt.verify(
        token,
        getKey,
        {
            algorithms: ["RS256"],
            // issuer 可以加強驗證, 但先關掉避免 URL 不合
            // issuer: "http://localhost:8081/realms/kpop-hub",
        },
        (err, decoded) => {
            if (err) {
                console.error("JWT verify error:", err);
                return res.status(401).json({ error: "Invalid token" });
            }

            // 把解好的 token payload 放在 req.auth
            req.auth = decoded;
            next();
        }
    );
}

module.exports = {
    verifyToken,
};
