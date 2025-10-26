import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ApplicationStatusPage.css';

const ApplicationStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from route state or localStorage
  const user = location.state?.user || JSON.parse(localStorage.getItem("loggedInUser"));

  // Redirect if no user found
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  if (!user) return null;

  const { username, application_status, user_id } = user;

  // Map backend status to display status
  const statusMapping = {
    approved: 'accepted',
    denied: 'denied',
    pending: 'pending'
  };

  const status = statusMapping[application_status] || 'pending';

  // Status configurations
  const statusConfig = {
    accepted: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#10B981"/>
          <path d="M34 18L20 32L14 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: '#D1FAE5',
      title: 'Application Accepted',
      subtitle: `Congratulations, ${username}!`,
      nextSteps: [
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.08 14.82 15.69 14.9 15.41 15.17L13.21 17.37C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.58C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Loan Officer Contact',
          description: 'A dedicated loan officer will reach out to you within 24-48 hours to discuss the final steps.'
        },
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 20V4H13V9H18V20H6Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Prepare Your Documents',
          description: 'Start gathering your final closing documents. A checklist will be available on your dashboard.'
        }
      ]
    },
    denied: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#EF4444"/>
          <path d="M18 18L30 30M30 18L18 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: '#FEE2E2',
      title: 'Application Denied',
      subtitle: `We're sorry, ${username}`,
      nextSteps: [
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Review Denial Reasons',
          description: "We've sent a detailed explanation to your email. Common reasons include insufficient income documentation or debt-to-income ratio."
        },
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Reapply in the Future',
          description: "You can reapply after addressing the concerns mentioned in the denial letter. We're here to help you succeed."
        }
      ]
    },
    pending: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#F59E0B"/>
          <path d="M24 12V24L32 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: '#FEF3C7',
      title: 'Application Under Review',
      subtitle: `Thank you for your patience, ${username}`,
      nextSteps: [
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Processing Your Application',
          description: 'Our team is carefully reviewing your income verification and financial documents. This typically takes 3-5 business days.'
        },
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" fill="#1976D2"/>
            </svg>
          ),
          title: 'Check Your Email',
          description: "We'll notify you immediately once a decision has been made. Keep an eye on your inbox and dashboard."
        }
      ]
    }
  };

  const currentStatus = statusConfig[status];

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="status-page">
      {/* Header */}
      <header className="status-header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1A2B4C"/>
          </svg>
          <span className="status-logo-text">GigIT</span>
        </div>
        <nav className="status-nav">
          <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
          <button className="icon-btn-nav">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="#A9B1C2"/>
            </svg>
          </button>
          <div className="user-avatar-nav">
            <img src="https://i.pravatar.cc/150?img=1" alt={username} />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="status-main">
        <div className="status-card">
          {/* Status Icon */}
          <div className="status-icon-container" style={{ backgroundColor: currentStatus.iconBg }}>
            {currentStatus.icon}
          </div>

          {/* Status Title */}
          <h1 className="status-title">{currentStatus.title}</h1>
          <p className="status-subtitle">{currentStatus.subtitle}</p>

          {/* Next Steps */}
          <div className="next-steps-section">
            <h2 className="next-steps-title">What Happens Next?</h2>
            
            <div className="next-steps-list">
              {currentStatus.nextSteps.map((step, index) => (
                <div key={index} className="next-step-item">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Info */}
          <p className="application-info">
            Application ID: {user_id} | Submitted: October 26, 2023
          </p>
        </div>
      </main>
    </div>
  );
};

export default ApplicationStatusPage;

