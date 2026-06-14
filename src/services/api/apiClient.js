/**
 * Centralized Axios client for the Resume Screener API.
 *
 * All requests are routed through a single instance so that:
 *  - Timeout, base URL, and default headers are configured once.
 *  - Request / response interceptors apply uniformly.
 *  - Error normalization is consistent across every service.
 *
 * The Vite dev-server proxy forwards /api → http://localhost:8080
 * so no CORS issues arise during development.
 */
import axios from 'axios';
import { API_BASE_URL } from '../config/index.js';

// ─── Instance ────────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300_000,   // 5 min — long polls for large batches
  headers: {
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.debug(`[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  // Success — pass the response through as-is
  (response) => response,

  // Error — normalize into a human-readable message
  (error) => {
    const status = error.response?.status;
    const serverMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === 'string' ? error.response.data : null);

    let message;

    if (!error.response) {
      // Network / CORS / backend not running
      message = 'Cannot connect to the server. Make sure the backend is running on port 8080.';
    } else if (status === 400) {
      message = serverMsg || 'Bad request — please check your input.';
    } else if (status === 404) {
      message = serverMsg || 'The requested resource was not found.';
    } else if (status === 409) {
      message = serverMsg || 'Conflict — this record already exists.';
    } else if (status === 413) {
      message = 'File too large. Maximum allowed size is 10 MB per file.';
    } else if (status === 422) {
      message = serverMsg || 'Validation failed — please check your input.';
    } else if (status >= 500) {
      message = 'Server error. Please try again in a moment.';
    } else {
      message = serverMsg || `Unexpected error (HTTP ${status}).`;
    }

    // Attach the normalised message so callers get it via err.message
    error.message = message;

    if (import.meta.env.DEV) {
      console.error(`[API] ✕ ${status ?? 'NETWORK'} — ${message}`, error);
    }

    return Promise.reject(error);
  }
);
