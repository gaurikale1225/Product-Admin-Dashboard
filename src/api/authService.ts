import axiosInstance from './axiosInstance';
import { AuthUser, LoginCredentials } from '@/types/auth';

/**
 * Logs in the user with username and password.
 * Supports custom credentials (username: gauri, password: gauri123)
 * as well as standard DummyJSON API credentials (username: emilys, password: emilyspass).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthUser> => {
  const { username, password } = credentials;

  // Custom user credential handling for Gauri
  if (username === 'gauri' && password === 'gauri123') {
    return {
      id: 888,
      username: 'gauri',
      email: 'gauri@Mystore.com',
      firstName: 'Gauri',
      lastName: 'Manager',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
      accessToken: 'gauri_session_token_' + Date.now(),
      refreshToken: 'gauri_refresh_token',
    };
  }

  // Fallback / standard DummyJSON auth endpoint
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
      expiresInMins: credentials.expiresInMins || 120,
    });
    return response.data;
  } catch (err: any) {
    throw new Error('Invalid username or password. Please use username "gauri" and password "gauri123".');
  }
};

/**
 * Gets the current authenticated user session details.
 * Endpoint: GET /auth/me
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
