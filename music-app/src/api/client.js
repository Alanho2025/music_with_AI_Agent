// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // 之後接 Keycloak 時可以在這裡加 headers
});

export default api;
