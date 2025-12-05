// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [initialized, setInitialized] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        keycloak
            .init({
                onLoad: "check-sso",
                pkceMethod: "S256", // 建議打開 PKCE
                silentCheckSsoRedirectUri:
                    window.location.origin + "/silent-check-sso.html",
            })
            .then(async (auth) => {
                setIsAuthenticated(auth);

                if (auth) {
                    setToken(keycloak.token);
                    try {
                        const userProfile = await keycloak.loadUserProfile();
                        setProfile(userProfile);
                    } catch (e) {
                        console.error("Failed to load user profile", e);
                    }
                    // 這裡從 token 解析 roles
                    const parsed = keycloak.tokenParsed || {};
                    const realmRoles =
                        parsed.realm_access?.roles || [];
                    const clientRoles =
                        parsed.resource_access?.["kpop-frontend"]?.roles || [];

                    const allRoles = Array.from(
                        new Set([...(realmRoles || []), ...(clientRoles || [])])
                    );

                    setRoles(allRoles);
                    setIsAdmin(allRoles.includes("admin"));
                }

                setInitialized(true);
            })
            .catch((err) => {
                console.error("Keycloak init error", err);
                setInitialized(true);
            });

        // token refresh
        const refreshInterval = setInterval(() => {
            if (keycloak.authenticated) {
                keycloak
                    .updateToken(60)
                    .then((refreshed) => {
                        if (refreshed) {
                            setToken(keycloak.token);
                        }
                    })
                    .catch((e) => {
                        console.error("Failed to refresh token", e);
                    });
            }
        }, 20000);

        return () => clearInterval(refreshInterval);
    }, []);

    // 一律用 window.location.origin => http://localhost:3000
    const login = () =>
        keycloak.login({
            redirectUri: window.location.origin,
        });

    const logout = () =>
        keycloak.logout({
            redirectUri: window.location.origin,
        });

    const register = () =>
        keycloak.register({
            redirectUri: window.location.origin,
        });

    const value = {
        initialized,
        isAuthenticated,
        profile,
        token,
        roles,
        isAdmin,
        login,
        logout,
        register,
    };
    

    return (
        <AuthContext.Provider value={value}>
            {initialized ? children : null}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
