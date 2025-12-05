// src/api/middlewares/roles.js
function requireRole(role) {
    return function (req, res, next) {
        if (!req.auth) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const realmRoles = req.auth.realm_access?.roles || [];
        const clientRoles =
            req.auth.resource_access?.["kpop-frontend"]?.roles || [];

        const allRoles = new Set([
            ...realmRoles,
            ...clientRoles,
        ]);

        if (!allRoles.has(role)) {
            return res.status(403).json({ error: "Forbidden: missing role " + role });
        }

        next();
    };
}

const requireAdmin = requireRole("admin");

module.exports = {
    requireRole,
    requireAdmin,
};
