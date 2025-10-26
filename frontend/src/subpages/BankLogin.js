import React from 'react';

const BankLogin = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1>Bank Partner Login</h1>
      <p>Please log in using your partner credentials.</p>
      <form style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Bank ID"
          style={{ padding: '10px', marginBottom: '10px', width: '250px' }}
        /><br />
        <input
          type="password"
          placeholder="Password"
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
    </div>
  );
};

export default BankLogin;
