import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, user, authError, setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Reset errors on initialization
  useEffect(() => {
    setAuthError(null);
    setLocalError('');
  }, [setAuthError]);

  // Navigate automatically if user session is already verified
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    // Local validator guards
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('Please fill in all requested registration fields.');
      return;
    }

    if (username.trim().length < 3) {
      setLocalError('Username must contain at least 3 characters.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    const result = await register(username, email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="page-container">
      {/* Background ambient glows */}
      <div className="ambient-wrapper">
        <div className="ambient-glow-top"></div>
        <div className="ambient-glow-center"></div>
      </div>

      <div className="crystal-card" style={{ transform: 'translateY(-10px)' }}>
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to instantiate a new developer console</p>
        </div>

        {(localError || authError) && (
          <div className="alert-box alert-box-error">
            <AlertCircle size={16} className="alert-icon" style={{ flexShrink: 0 }} />
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <User size={16} />
              </span>
              <input
                id="username"
                type="text"
                className="form-input form-input-with-icon"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                className="form-input form-input-with-icon"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input form-input-with-icon form-input-with-toggle"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input form-input-with-icon form-input-with-toggle"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="spinner"></span>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already registered?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
