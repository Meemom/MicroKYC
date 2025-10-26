import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../test_data/user_data.js';
import './UserLogin.css';

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Find the user in demo data
    const user = userData.find(u => u.username === username);

    // Username check
    if (!user) {
      setError('User not found');
      return;
    }

    // Password check
    if (user.password !== password) {
      setError('Incorrect password');
      return;
    }

    setError('');

    // Save to local storage so refresh doesn't lose the data
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Navigate with user data in state (for first load)
    navigate('/application-results', { state: { user } });
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if username already exists
    const existingUser = userData.find(u => u.username === username);
    if (existingUser) {
      setError('Username already exists');
      return;
    }

    setError('');

    // Create new user with pending status
    const newUser = {
      user_id: String(userData.length + 1),
      username: username,
      application_status: 'pending',
      password: password
    };

    // Add to userData array (for demo purposes)
    userData.push(newUser);

    // Save to local storage
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    // Navigate to application results
    navigate('/application-results', { state: { user: newUser } });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1976D2"/>
          </svg>
          <h1 className="logo-title">GigIT</h1>
        </div>

        {/* Welcome Text */}
        <div className="login-header">
          <h2 className="login-title">
            {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
          </h2>
          <p className="login-subtitle">
            {isSignUp 
              ? 'Sign up to start your mortgage application journey'
              : 'Please log in to continue your mortgage application journey'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
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

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-submit">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {/* Toggle between Login/Sign Up */}
        <div className="toggle-mode">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={toggleMode} className="toggle-button">
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="demo-info">
          <p className="demo-text">Demo Users:</p>
          <div className="demo-users">
            <span className="demo-user">WillSmith (approved)</span>
            <span className="demo-user">BobDylan (denied)</span>
            <span className="demo-user">MichaelJackson (pending)</span>
          </div>
          <p className="demo-password">Password for all: 123</p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
