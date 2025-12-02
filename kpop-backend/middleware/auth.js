// middlewares/auth.js
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
    jwksUri:
        "http://localhost:8081/realms/kpop-hub/protocol/openid-connect/certs",
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

// 驗證 Bearer token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    jwt.verify(
        token,
        getKey,
        {
            issuer: "http://localhost:8081/realms/kpop-hub",
            // audience: "kpop-frontend", // 如果驗證過不了可以先暫時拿掉這行
            algorithms: ["RS256"],
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
