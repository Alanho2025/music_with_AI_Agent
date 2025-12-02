// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [initialized, setInitialized] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        keycloak
            .init({
                onLoad: "check-sso",
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

    const login = () => keycloak.login();
    const logout = () => keycloak.logout({ redirectUri: window.location.origin });

    const value = {
        initialized,
        isAuthenticated,
        profile,
        token,
        login,
        logout,
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
