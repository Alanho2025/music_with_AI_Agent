// src/auth/keycloak.js
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8081",      // my keycloak server URL
    realm: "kpop-hub",                 // 
    clientId: "kpop-frontend",         //my client ID
});

export default keycloak;