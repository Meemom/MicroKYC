import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import actionRequiredApps from '../test_data/action_required_apps.js'; 
import allApplications from '../test_data/application_data.js'; 

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

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

          <div className="header-right">
            <button className="btn-new-application">New Application</button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6.66669L10 11.6667L5 6.66669" stroke="#A9B1C2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="#A9B1C2"/>
              </svg>
            </button>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/150?img=68" alt="User" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Mortgage Application Dashboard</h1>

          {/* Action Required Section */}
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
                  <button className="btn-view-details">View Details</button>
                </div>
              ))}
            </div>
          </section>

          {/* All Applications Section */}
          <section className="all-applications-section">
            <div className="section-header-apps">
              <h2 className="section-title">All Applications</h2>
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
                          <button className="btn-view-details-table">View Details</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination-info">Showing 1 to 4 of 25 results</span>
              <div className="pagination-buttons">
                <button className="pagination-btn" disabled>Previous</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
