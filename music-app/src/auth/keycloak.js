// src/auth/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://music-hub.duckdns.org/auth', // my keycloak server URL
  realm: 'kpop-hub', //
  clientId: 'kpop-frontend', //my client ID
});

export default keycloak;
