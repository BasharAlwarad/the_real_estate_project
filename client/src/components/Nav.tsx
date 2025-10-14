import { NavLink } from 'react-router-dom';
import api from '../utils/api';
import React, { useState, useEffect } from 'react';
import Themes from './Themes';

const Nav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/users/me');
        setIsAuthenticated(res.status === 200 && !!res.data.user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors
    } finally {
      window.location.href = '/';
    }
  };

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
        {loading ? null : isAuthenticated ? (
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
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
