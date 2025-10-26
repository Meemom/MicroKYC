import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../test_data/user_data.js';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // optional if you want a demo password check
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Find user in demo data
    const user = userData.find(u => u.username === username);
    if (!user) {
      setError('User not found');
      return;
    }
    
    setError('');

    // Decide navigation based on application_status
    if (user.application_status === 'incomplete') {
      navigate('/verify'); // go back to verification page
    } else {
      navigate('/application-results'); // go to results page
    }
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
