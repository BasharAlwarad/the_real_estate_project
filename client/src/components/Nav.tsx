import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Themes from './Themes';
import { isAuthenticated, getUser, logout } from '../utils/auth';

interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Nav = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      if (authStatus) {
        setUser(getUser());
      }
    };

    checkAuth();

    // Listen for storage changes to update auth state
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'btn btn-ghost text-primary font-bold' : 'btn btn-ghost';

  return (
    <nav className="px-4 navbar bg-base-100">
      <div className="navbar-start">
        <NavLink to="/" className={activeLink}>
          Real estate
        </NavLink>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          <li>
            <NavLink to="/listings" className={activeLink}>
              Listings
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={activeLink}>
              Users
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-2 items-center">
        {authenticated ? (
          <>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Welcome, {user.userName}</span>
              </div>
            )}
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={activeLink}>
              Login
            </NavLink>
            <NavLink to="/signup" className={activeLink}>
              Signup
            </NavLink>
          </>
        )}
        <Themes />
      </div>
    </nav>
  );
};

export default Nav;
