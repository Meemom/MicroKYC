import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from '../services/ApplicationService';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allApplications, setAllApplications] = useState([]);
  const [actionRequiredApps, setActionRequiredApps] = useState([]);

  // Load applications from localStorage on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const apps = ApplicationService.getAllApplications();
    const actionApps = ApplicationService.getActionRequired();
    
    setAllApplications(apps);
    setActionRequiredApps(actionApps);
  };

  // Refresh applications (call after any updates)
  const refreshData = () => {
    loadApplications();
  };

  const getFilteredApplications = () => {
    if (activeTab === 'all') return allApplications;
    if (activeTab === 'pending') return allApplications.filter(app => app.status === 'pending');
    if (activeTab === 'approved') return allApplications.filter(app => app.status === 'approved');
    if (activeTab === 'requires-action') return allApplications.filter(app => app.status === 'rejected');
    return allApplications;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { label: 'Approved', class: 'status-approved' },
      pending: { label: 'Pending', class: 'status-pending' },
      rejected: { label: 'Rejected', class: 'status-rejected' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleViewDetails = (appId) => {
    // Navigate to application details page
    navigate(`/application-details/${appId}`);
  };

  const handleNewApplication = () => {
    navigate('/verify');
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1A2B4C"/>
            <path d="M16 12C14.9 12 14 12.9 14 14V18C14 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18V14C18 12.9 17.1 12 16 12Z" fill="white"/>
            </svg>
            <div>
              <div className="sidebar-title">GigIT</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H9V9H3V3ZM11 3H17V9H11V3ZM11 11H17V17H11V11ZM3 11H9V17H3V11Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/applications')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2H14L18 6V18H2V2H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 2V6H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Applications
          </button>
          <button className="nav-item" onClick={() => navigate('/risk-configuration')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 6V10C3 14.5 6.5 18 10 18C13.5 18 17 14.5 17 10V6L10 2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 10H13M10 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Risk Configuration
          </button>
          <button className="nav-item" onClick={() => navigate('/settings')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 1V4M10 16V19M19 10H16M4 10H1M16.24 16.24L14.12 14.12M5.88 5.88L3.76 3.76M16.24 3.76L14.12 5.88M5.88 14.12L3.76 16.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Support
          </button>
          <button className="nav-item" onClick={() => navigate('/login')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16L18 10L13 4M18 10H6M10 16C10 16 6 13.5 6 10C6 6.5 10 4 10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="search-bar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#A9B1C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#A9B1C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input type="text" placeholder="Search applications..." />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Mortgage Application Dashboard</h1>

          {/* Action Required Section */}
          {actionRequiredApps.length > 0 && (
            <section className="action-required-section">
              <div className="section-header-action">
                <span className="action-badge">ACTION REQUIRED</span>
                <h2 className="section-title">{actionRequiredApps.length} Applications Need Your Attention</h2>
                <p className="section-subtitle">Review applications that need immediate attention to proceed.</p>
              </div>

              <div className="action-cards">
                {actionRequiredApps.map((app) => (
                  <div key={app.id} className="action-card">
                    <div className="card-left">
                      <img src={app.avatar} alt={app.name} className="applicant-avatar" />
                      <div className="applicant-info">
                        <h3 className="applicant-name">{app.name} - {app.status}</h3>
                        <p className="application-id">Application ID: {app.id}</p>
                      </div>
                    </div>
                    <button className="btn-view-details" onClick={() => handleViewDetails(app.id)}>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {allApplications.length === 0 && (
            <div className="empty-state">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" fill="#F5F7FA"/>
                <path d="M60 35V75M45 60H75" stroke="#A9B1C2" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <h3>No Applications Yet</h3>
              <p>New applications will appear here once they're submitted</p>
              <button className="btn-create-demo" onClick={handleNewApplication}>
                Create Demo Application
              </button>
            </div>
          )}

          {/* All Applications Section */}
          {allApplications.length > 0 && (
            <section className="all-applications-section">
              <div className="section-header-apps">
                <h2 className="section-title">All Applications ({allApplications.length})</h2>
                <div className="filter-tabs">
                  {['all', 'pending', 'approved', 'requires-action'].map(tab => (
                    <button 
                      key={tab}
                      className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'requires-action' ? 'Requires Action' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="applications-table-container">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Applicant Name</th>
                      <th>Application ID</th>
                      <th>Submission Date</th>
                      <th>Loan Amount</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredApplications().map((app) => {
                      const statusInfo = getStatusBadge(app.status);
                      return (
                        <tr key={app.id}>
                          <td className="applicant-name-cell">{app.name}</td>
                          <td className="app-id-cell">{app.id}</td>
                          <td className="date-cell">{app.submissionDate}</td>
                          <td className="amount-cell">{app.loanAmount}</td>
                          <td>
                            <span className={`status-badge ${statusInfo.class}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-view-details-table"
                              onClick={() => handleViewDetails(app.id)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="pagination-info">
                  Showing {getFilteredApplications().length} of {allApplications.length} results
                </span>
                <div className="pagination-buttons">
                  <button className="pagination-btn" disabled>Previous</button>
                  <button className="pagination-btn" disabled>Next</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;