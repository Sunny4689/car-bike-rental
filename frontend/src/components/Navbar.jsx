import { Link, useNavigate } from 'react-router-dom';
import {
  FaCar,
  FaMotorcycle,
  FaUserCircle,
  FaShieldAlt,
  FaCalendarCheck,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import WheelLogo from './WheelLogo';
import toast from 'react-hot-toast';

const Navbar = ({ user, setUser, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 border-b border-base-300 shadow-sm transition-colors">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-2xl w-52 border border-base-300">
            <li><Link to="/">Explore All</Link></li>
            <li><Link to="/?type=Car">Cars</Link></li>
            <li><Link to="/?type=Bike">Bikes</Link></li>
            {user && <li><Link to="/my-bookings">My Bookings</Link></li>}
            {user && <li><Link to="/profile">My Profile & License</Link></li>}
            {user?.role === 'admin' && <li><Link to="/admin" className="text-secondary font-bold">Admin Portal</Link></li>}
          </ul>
        </div>

        {/* Brand Logo & Title */}
        <Link to="/" className="btn btn-ghost normal-case text-xl font-extrabold flex items-center gap-2.5 px-2 hover:bg-transparent">
          <WheelLogo size="md" />
          <div className="flex flex-col text-left">
            <div className="flex items-center tracking-tight leading-none text-2xl font-black text-base-content">
              <span>Wheel</span>
              <span className="text-secondary">Share</span>
            </div>
            <span className="text-[9px] tracking-widest text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">
              Automotive Rentals
            </span>
          </div>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1 font-semibold text-sm text-base-content/80">
          <li><Link to="/" className="hover:text-base-content transition-colors">Fleet</Link></li>
          <li><Link to="/?type=Car" className="hover:text-base-content flex items-center gap-1.5 transition-colors"><FaCar /> Cars</Link></li>
          <li><Link to="/?type=Bike" className="hover:text-base-content flex items-center gap-1.5 transition-colors"><FaMotorcycle /> Bikes</Link></li>
          {user && (
            <li>
              <Link to="/my-bookings" className="hover:text-base-content flex items-center gap-1.5 transition-colors">
                <FaCalendarCheck className="text-secondary" /> My Bookings
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin" className="badge badge-outline border-secondary text-secondary mt-2 font-bold flex items-center gap-1.5 hover:bg-secondary hover:text-white">
                <FaShieldAlt /> Admin Portal
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2.5">
        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm text-base text-base-content/80 hover:text-secondary hover:bg-base-200 transition-all"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun className="text-secondary" />}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm flex items-center gap-2 rounded-xl px-2.5">
              <FaUserCircle className="text-xl text-secondary" />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold leading-tight text-base-content">{user.name}</div>
                <div className="text-[10px] text-gray-500 capitalize">{user.role}</div>
              </div>
              {/* License Status Indicator */}
              {user.licenseStatus === 'verified' && (
                <span className="badge badge-success badge-xs" title="License Verified"></span>
              )}
              {user.licenseStatus === 'pending' && (
                <span className="badge badge-warning badge-xs" title="License Pending Verification"></span>
              )}
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-2xl w-60 border border-base-300">
              <li className="menu-title px-4 py-2 border-b border-base-200">
                <span className="font-bold text-base-content">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
                <div className="mt-1">
                  {user.licenseStatus === 'verified' ? (
                    <span className="badge badge-success badge-sm text-white">✓ License Verified</span>
                  ) : user.licenseStatus === 'pending' ? (
                    <span className="badge badge-warning badge-sm">⏳ Verification Pending</span>
                  ) : (
                    <span className="badge badge-error badge-sm text-white">Upload License</span>
                  )}
                </div>
              </li>
              <li><Link to="/profile">Profile & License</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              {user.role === 'admin' && <li><Link to="/admin" className="font-bold text-secondary">Admin Portal</Link></li>}
              <div className="divider my-1"></div>
              <li><button onClick={handleLogout} className="text-error font-medium">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm text-xs font-bold">Sign In</Link>
            <Link to="/register" className="btn btn-neutral btn-sm text-xs font-bold shadow-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
