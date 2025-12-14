// src/api/secureClient.js
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

export function useSecureApi() {
  const { token } = useAuth();

  const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}
