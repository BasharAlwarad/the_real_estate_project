import axios from 'axios';
import { API_CONFIG } from './config';

/**
 * Auth API Instance
 *
 * Dedicated axios instance for authentication service
 * All auth operations (login, signup, refresh, logout) use this instance
 */

const authApi = axios.create({
  baseURL: API_CONFIG.AUTH_SERVICE,
  withCredentials: true,
});

export default authApi;
