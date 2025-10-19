/**
 * API Configuration
 *
 * Separate endpoints for auth microservice and main application server
 */

export const API_CONFIG = {
  AUTH_SERVICE:
    import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000',
  MAIN_SERVICE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
};
