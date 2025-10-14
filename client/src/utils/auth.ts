interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getSession = (): string | null => {
  return localStorage.getItem('session');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const session = getSession();
  const user = getUser();
  return !!(session && user);
};

export const logout = (): void => {
  localStorage.removeItem('session');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const setAuthData = (session: string, user: User): void => {
  localStorage.setItem('session', session);
  localStorage.setItem('user', JSON.stringify(user));
};
