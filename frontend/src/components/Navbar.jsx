import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-navbar">
      <Link to="/" className="brand-container">
        <Shield size={20} strokeWidth={2.5} />
        <span>AURA</span>
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <div className="user-badge">
              <User size={13} />
              <span>{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                borderRadius: '6px',
                display: 'inline-flex',
                width: 'auto',
                gap: '6px',
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
