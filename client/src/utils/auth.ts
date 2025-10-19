import authApi from './authApi';

interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch current user from auth service
export const getUser = async (): Promise<User | null> => {
  try {
    const res = await authApi.get('/auth/me');
    if (res.status !== 200) return null;
    return res.data.user || null;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authApi.post('/auth/logout');
  } catch {
    // Ignore errors
  }
  window.location.href = '/login';
};
