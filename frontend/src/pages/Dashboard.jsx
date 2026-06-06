import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Key, Calendar, Mail, UserCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [authStatus, setAuthStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const testProtectedRoute = async () => {
    setTesting(true);
    setAuthStatus(null);
    try {
      const res = await axios.get('/api/auth/me');
      setAuthStatus({
        success: true,
        message: 'Token verification succeeded. Secured payload successfully parsed!',
        data: res.data,
      });
    } catch (err) {
      setAuthStatus({
        success: false,
        message: err.response?.data?.message || 'Verification failed. Token invalid or expired.',
      });
    } finally {
      setTesting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Loading...';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container">
      {/* Background ambient glows */}
      <div className="ambient-wrapper">
        <div className="ambient-glow-top"></div>
        <div className="ambient-glow-center"></div>
      </div>

      <div className="crystal-card" style={{ maxWidth: '600px', transform: 'translateY(-10px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            background: 'rgba(48, 209, 88, 0.08)',
            border: '1px solid rgba(48, 209, 88, 0.15)',
            borderRadius: '50%',
            marginBottom: '16px',
            color: '#30d158'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 className="auth-title">Console Dashboard</h1>
          <p className="auth-subtitle">Access authorized under active JWT validation state</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* User Details Grid */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              color: 'var(--text-secondary)'
            }}>
              <UserCheck size={14} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Profile Details</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{user?.username}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <Mail size={12} className="text-muted" />
              <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
            </div>
          </div>

          {/* Registration Info Grid */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              color: 'var(--text-secondary)'
            }}>
              <Calendar size={14} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Creation Stamp</span>
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Account Created</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Token Inspection Panel */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: 'var(--text-secondary)'
          }}>
            <Key size={14} />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>JSON Web Token Signature</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Authorization Bearer header value persisted in browser local storage:
          </p>
          <div className="token-code-panel">{token || 'No token found in current context'}</div>
        </div>

        {/* Action checks */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <button
            onClick={testProtectedRoute}
            className="btn-secondary"
            disabled={testing}
            style={{ width: '100%', gap: '8px', borderRadius: '8px' }}
          >
            {testing ? (
              <span className="spinner spinner-light"></span>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Verify Token Authorization</span>
              </>
            )}
          </button>

          {authStatus && (
            <div
              className={`alert-box ${authStatus.success ? 'alert-box-success' : 'alert-box-error'}`}
              style={{ marginTop: '16px', marginBottom: 0 }}
            >
              <span>{authStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
