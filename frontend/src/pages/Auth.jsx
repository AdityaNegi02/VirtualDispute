import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', mobile: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }
    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    try {
      const { data } = await axios.post(url, formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '60px 0' }}>
      <div>
        <span className="label-small" style={{ marginBottom: '20px' }}>
          {isLogin ? 'Welcome Back' : 'System Enrollment'}
        </span>
        <h1 className="font-display">
          {isLogin ? 'Access Portal' : 'Create Identity'}
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.7, lineHeight: '1.6', marginTop: '32px' }}>
          Log in to manage your active legal jurisdictions or enroll a new identity in the Virtual Dispute Resolution Protocol.
        </p>
      </div>

      <div className="card-minimal">
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="label-small">Legal Full Name</label>
              <input 
                className="input-minimal"
                type="text" placeholder="ADITYA NEGI" required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          )}
          <div>
            <label className="label-small">Mobile Identifier (10 Digits)</label>
            <input 
              className="input-minimal"
              type="text" placeholder="9876543210" required 
              maxLength={10}
              onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} 
              value={formData.mobile}
            />
          </div>
          <div>
            <label className="label-small">Security Passkey</label>
            <input 
              className="input-minimal"
              type="password" placeholder="••••••••" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button className="btn-black" type="submit" style={{ width: '100%', marginTop: '20px' }}>
            {isLogin ? 'Authenticate →' : 'Enroll Identity →'}
          </button>
        </form>
        
        <p 
          onClick={() => setIsLogin(!isLogin)} 
          className="font-mono"
          style={{ textAlign: 'center', marginTop: '32px', cursor: 'pointer', opacity: 0.5 }}
        >
          {isLogin ? "New user? Enroll identity" : "Existing user? Portal access"}
        </p>
      </div>
    </div>
  );
};

export default Auth;