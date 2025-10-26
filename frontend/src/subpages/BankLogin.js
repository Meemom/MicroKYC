import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bankData from '../test_data/mock_bank_partners.js';

const BankLogin = () => {
  const navigate = useNavigate();
  const [bankID, setBankID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  
    const bank = bankData.find(b => b.bank_id === bankID); 
  
    // check if bank exists, is active, and password matches
    if (bank && bank.status === 'active' && bank.password === password) {
      setError('');
      navigate('/dashboard'); // go to dashboard
    } else {
      setError('Invalid Bank ID or Password');
    }
  };
  

  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1>Bank Partner Login</h1>
      <p>Please log in using your partner credentials.</p>
      <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Bank ID"
          value={bankID}
          onChange={(e) => setBankID(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '250px' }}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', width: '250px' }}
        /><br />
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
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default BankLogin;
