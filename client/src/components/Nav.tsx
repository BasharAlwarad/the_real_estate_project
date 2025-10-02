import { NavLink } from 'react-router-dom';
import Themes from './Themes';

const Nav = () => {
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
      <div className="navbar-end">
        <NavLink to="/signup" className={activeLink}>
          Signup
        </NavLink>
        <Themes />
      </div>
    </nav>
  );
};

export default Nav;
