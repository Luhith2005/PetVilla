import React, { useState } from 'react';
import { X, User, Mail, Shield, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccess(false);

    const res = await updateProfile(formData);
    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } else {
      setErrorMsg('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <User className="text-primary" size={24} />
            <h2>Pet Parent Profile</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {success && (
            <div className="badge badge-success p-2 w-full mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
              <Check size={16} /> Profile updated successfully!
            </div>
          )}
          {errorMsg && (
            <div className="form-error-banner">{errorMsg}</div>
          )}

          <div className="account-info-banner">
            <div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Username:</span>
              <div className="font-bold">@{user?.username}</div>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Account Type:</span>
              <div>
                <span className="badge badge-primary">{user?.user_type}</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
