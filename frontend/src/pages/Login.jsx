import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, user, authError, setAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Reset context and local validation errors on component mount
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

    // Simple validation guards
    if (!email.trim() || !password) {
      setLocalError('Please enter both your email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
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

      <div className="crystal-card" style={{ transform: 'translateY(-20px)' }}>
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to resume secure console access</p>
        </div>

        {(localError || authError) && (
          <div className="alert-box alert-box-error">
            <AlertCircle size={16} className="alert-icon" style={{ flexShrink: 0 }} />
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
                placeholder="username@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input form-input-with-icon form-input-with-toggle"
                placeholder="Enter password"
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

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="spinner"></span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          New to Aura?{' '}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
