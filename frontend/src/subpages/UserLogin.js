import React from 'react';

const UserLogin = () => {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h1>Welcome to GigIT!</h1>
        <p>Please sign up to start your mortgage application journey. </p>
        <form style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Username"
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
            Sign Up
          </button>
        </form>
      </div>
    );
  };
  
  export default UserLogin;