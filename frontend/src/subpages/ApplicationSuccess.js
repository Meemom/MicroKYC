import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationSuccess.css';

const ApplicationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
          >
            <circle cx="30" cy="30" r="28" strokeOpacity="0.4" />
            <path d="M20 30l7 7 13-14" />
          </svg>
        </div>

        <h1 className="success-title">Application Submitted Successfully!</h1>
        <p className="success-message">
          Thank you for submitting your mortgage application. <br />
          Our team will review your information and get back to you shortly.
        </p>

        <button className="success-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ApplicationSuccess;
