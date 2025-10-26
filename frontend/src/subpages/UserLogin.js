import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../test_data/user_data.js';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1>Welcome to GigIT!</h1>
      <p>Please log in to continue your mortgage application journey.</p>
      <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '250px' }}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', width: '250px' }}
        /><br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#1A2B4C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
