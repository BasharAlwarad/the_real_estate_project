interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// In cookie-based auth, getUser should fetch from backend if needed
export const getUser = async (): Promise<User | null> => {
  try {
    const res = await fetch('/users/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  // Optionally call backend to clear cookie
  window.location.href = '/login';
};
