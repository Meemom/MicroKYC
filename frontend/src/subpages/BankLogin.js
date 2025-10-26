import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BankLogin.css';

const BankLogin = () => {
  const [bankId, setBankId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Available banks with passwords (for demo)
  const banks = [
    { id: 'BANK001', name: 'Chase Bank', password: 'chase123' },
    { id: 'BANK002', name: 'Wells Fargo', password: 'wells123' },
    { id: 'BANK003', name: 'Bank of America', password: 'boa123' },
    { id: 'BANK004', name: 'Citibank', password: 'citi123' },
    { id: 'BANK005', name: 'US Bank', password: 'usbank123' },
    { id: 'BANK006', name: 'PNC Bank', password: 'pnc123' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    // Find the bank
    const bank = banks.find(b => b.id === bankId);

    // Bank ID check
    if (!bank) {
      setError('Invalid Bank ID');
      return;
    }

    // Password check
    if (bank.password !== password) {
      setError('Incorrect password');
      return;
    }

    setError('');

    // Save bank info to localStorage
    localStorage.setItem('loggedInBank', JSON.stringify({
      bankId: bank.id,
      bankName: bank.name
    }));

    // Navigate to dashboard with bank ID
    navigate('/dashboard', { state: { bankId: bank.id, bankName: bank.name } });
  };

  return (
    <div className="bank-login-page">
      <div className="bank-login-container">
        {/* Logo */}
        <div className="bank-login-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#10B981" stroke="#10B981" strokeWidth="2"/>
            <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="logo-title">GigIT</h1>
          <p className="logo-subtitle">for Banks</p>
        </div>

        {/* Welcome Text */}
        <div className="bank-login-header">
          <h2 className="bank-login-title">Bank Portal Login</h2>
          <p className="bank-login-subtitle">
            Enter your Bank ID and password to access your application dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bank-login-form">
          <div className="form-group">
            <label htmlFor="bankId">Bank ID</label>
            <select
              id="bankId"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              required
              className="form-input"
            >
              <option value="">Select your bank...</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name} ({bank.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-submit">
            Access Dashboard
          </button>
        </form>

        {/* Demo Info */}
        <div className="demo-info">
          <p className="demo-text">Demo Banks:</p>
          <div className="demo-banks">
            <div className="demo-bank">
              <strong>Chase Bank</strong>
              <span>ID: BANK001 | Password: chase123</span>
            </div>
            <div className="demo-bank">
              <strong>Wells Fargo</strong>
              <span>ID: BANK002 | Password: wells123</span>
            </div>
            <div className="demo-bank">
              <strong>Bank of America</strong>
              <span>ID: BANK003 | Password: boa123</span>
            </div>
          </div>
        </div>

        {/* Link to User Login */}
        <div className="switch-portal">
          <p>
            Are you an applicant?{' '}
            <button onClick={() => navigate('/user-login')} className="switch-button">
              Go to User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankLogin;
