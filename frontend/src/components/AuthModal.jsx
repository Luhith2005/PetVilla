import React, { useState } from 'react';
import { X, Lock, User, Mail, Store, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
  const { login, register, authError } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'customer',
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFillDemo = (type) => {
    if (type === 'customer') {
      setTab('login');
      setFormData({
        username: 'alex_customer',
        password: 'CustomerPass123',
        email: '',
        user_type: 'customer',
      });
    } else {
      setTab('login');
      setFormData({
        username: 'alice_petshop',
        password: 'SellerPass123',
        email: '',
        user_type: 'seller',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    let res;
    if (tab === 'login') {
      res = await login(formData.username, formData.password);
    } else {
      res = await register(formData);
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setLocalError(res.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-logo-badge">🐾 PetVilla</div>
          <h2>{tab === 'login' ? 'Welcome Back!' : 'Join PetVilla'}</h2>
          <p className="text-muted">
            {tab === 'login'
              ? 'Sign in to access your saved pet basket and orders'
              : 'Create your account to start shopping or selling'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="demo-credentials-box">
          <span className="demo-title">⚡ Instant Demo Logins:</span>
          <div className="demo-btns-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('customer')}
            >
              🐶 Customer Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('seller')}
            >
              🏪 Seller Demo
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tab-bar">
          <button
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {(localError || authError) && (
            <div className="form-error-banner">
              {localError || authError}
            </div>
          )}

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">I want to:</label>
              <div className="role-selector-grid">
                <label
                  className={`role-option-card ${
                    formData.user_type === 'customer' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="user_type"
                    value="customer"
                    checked={formData.user_type === 'customer'}
                    onChange={handleChange}
                  />
                  <span className="role-icon">🐶</span>
                  <div>
                    <strong>Pet Parent</strong>
                    <span>Shop food & supplies</span>
                  </div>
                </label>

                <label
                  className={`role-option-card ${
                    formData.user_type === 'seller' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="user_type"
                    value="seller"
                    checked={formData.user_type === 'seller'}
                    onChange={handleChange}
                  />
                  <span className="role-icon">🏪</span>
                  <div>
                    <strong>Pet Store / Seller</strong>
                    <span>List & sell products</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. happy_paw"
                required
                className="form-input"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block mt-2"
            disabled={loading}
          >
            {loading ? (
              'Authenticating...'
            ) : tab === 'login' ? (
              <>
                Sign In to PetVilla <ArrowRight size={18} />
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
