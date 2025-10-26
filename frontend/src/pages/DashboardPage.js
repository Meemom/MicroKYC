import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from '../services/ApplicationService';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allApplications, setAllApplications] = useState([]);
  const [actionRequiredApps, setActionRequiredApps] = useState([]);
  const [bankInfo, setBankInfo] = useState(null);

  // Load bank info and applications on mount
  useEffect(() => {
    const loggedInBank = JSON.parse(localStorage.getItem('loggedInBank'));
    
    if (!loggedInBank) {
      navigate('/bank-login');
      return;
    }

    setBankInfo(loggedInBank);
    loadApplications(loggedInBank.bankId);
  }, [navigate]);

  const loadApplications = (bankId) => {
    const apps = ApplicationService.getAllApplications(bankId);
    const actionApps = ApplicationService.getActionRequired(bankId);
    
    setAllApplications(apps);
    setActionRequiredApps(actionApps);
  };

  const refreshData = () => {
    if (bankInfo) {
      loadApplications(bankInfo.bankId);
    }
  };

  // Calculate statistics
  const getStats = () => {
    const total = allApplications.length;
    const pending = allApplications.filter(app => app.status === 'pending').length;
    const approved = allApplications.filter(app => app.status === 'approved').length;
    const rejected = allApplications.filter(app => app.status === 'rejected').length;
    
    const totalLoanAmount = allApplications.reduce((sum, app) => {
      const amount = parseFloat(app.loanAmount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

    return { total, pending, approved, rejected, totalLoanAmount };
  };

  const stats = getStats();

  const getFilteredApplications = () => {
    if (activeTab === 'all') return allApplications;
    if (activeTab === 'pending') return allApplications.filter(app => app.status === 'pending');
    if (activeTab === 'approved') return allApplications.filter(app => app.status === 'approved');
    if (activeTab === 'requires-action') return allApplications.filter(app => app.status === 'rejected');
    return allApplications;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { label: 'Approved', class: 'status-approved', icon: '✓' },
      pending: { label: 'Pending Review', class: 'status-pending', icon: '⏱' },
      rejected: { label: 'Needs Attention', class: 'status-rejected', icon: '!' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleViewDetails = (appId) => {
    navigate(`/application-details/${appId}`);
  };

  const handleNewApplication = () => {
    navigate('/verify');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInBank');
    navigate('/bank-login');
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1A2B4C"/>
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
          <button className="nav-item" onClick={() => navigate('/analytics')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 17H18M5 13V17M10 9V17M15 5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
          <button className="nav-item" onClick={handleLogout}>
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
              <input type="text" placeholder="Search applications by name, ID, or amount..." />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {/* Title Section */}
          <div className="dashboard-title-section">
            <div>
              <h1 className="dashboard-title">Dashboard Overview</h1>
              <p className="dashboard-subtitle">Monitor and manage mortgage applications</p>
            </div>
            {bankInfo && (
              <div className="bank-badge">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L3 6V10C3 14.5 6.5 18 10 18C13.5 18 17 14.5 17 10V6L10 2Z" fill="#10B981"/>
                </svg>
                <span>{bankInfo.bankName}</span>
                <span className="bank-id">{bankInfo.bankId}</span>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-total">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Applications</span>
                <span className="stat-value">{stats.total}</span>
                <span className="stat-change positive">+12% from last month</span>
              </div>
            </div>

            <div className="stat-card stat-card-pending">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Pending Review</span>
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-change">Awaiting decision</span>
              </div>
            </div>

            <div className="stat-card stat-card-approved">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Approved</span>
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-change positive">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% approval rate
                </span>
              </div>
            </div>

            <div className="stat-card stat-card-amount">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Loan Amount</span>
                <span className="stat-value">${(stats.totalLoanAmount / 1000000).toFixed(1)}M</span>
                <span className="stat-change">Across all applications</span>
              </div>
            </div>
          </div>

          {/* Action Required Section */}
          {actionRequiredApps.length > 0 && (
            <section className="action-required-section">
              <div className="section-header-action">
                <div className="section-header-left">
                  <div className="action-badge-new">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1V15M1 8H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {actionRequiredApps.length}
                  </div>
                  <div>
                    <h2 className="section-title">Applications Need Your Attention</h2>
                    <p className="section-subtitle">Review these applications to proceed with processing</p>
                  </div>
                </div>
                <button className="btn-view-all">View All</button>
              </div>

              <div className="action-cards">
                {actionRequiredApps.map((app) => (
                  <div key={app.id} className="action-card-new">
                    <div className="action-card-header">
                      <img src={app.avatar} alt={app.name} className="applicant-avatar-new" />
                      <div className="applicant-info-new">
                        <h3 className="applicant-name-new">{app.name}</h3>
                        <p className="application-id-new">{app.id}</p>
                      </div>
                      <span className="status-badge-mini status-rejected">
                        ! Needs Review
                      </span>
                    </div>
                    <div className="action-card-footer">
                      <div className="quick-info">
                        <span className="quick-info-item">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" stroke="#A9B1C2" strokeWidth="1.5"/>
                            <path d="M8 4V8L10 10" stroke="#A9B1C2" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          2 days ago
                        </span>
                        <span className="quick-info-item">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 1V15M1 8H15" stroke="#A9B1C2" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          High Priority
                        </span>
                      </div>
                      <button className="btn-review" onClick={() => handleViewDetails(app.id)}>
                        Review Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {allApplications.length === 0 && (
            <div className="empty-state-new">
              <div className="empty-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="50" fill="#F5F7FA"/>
                  <path d="M40 50H80M40 60H70M40 70H75" stroke="#A9B1C2" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="35" y="35" width="50" height="60" rx="4" stroke="#A9B1C2" strokeWidth="3"/>
                </svg>
              </div>
              <h3 className="empty-title">No Applications Yet</h3>
              <p className="empty-description">
                Start by creating a new application or wait for applicants to submit their mortgage applications.
              </p>
              <button className="btn-create-demo" onClick={handleNewApplication}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create New Application
              </button>
            </div>
          )}

          {/* All Applications Section */}
          {allApplications.length > 0 && (
            <section className="all-applications-section">
              <div className="section-header-apps">
                <div>
                  <h2 className="section-title">All Applications</h2>
                  <p className="section-subtitle">{allApplications.length} total applications</p>
                </div>
                <div className="filter-tabs">
                  {[
                    { id: 'all', label: 'All', count: stats.total },
                    { id: 'pending', label: 'Pending', count: stats.pending },
                    { id: 'approved', label: 'Approved', count: stats.approved },
                    { id: 'requires-action', label: 'Needs Action', count: stats.rejected }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                      <span className="tab-count">{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="applications-table-container">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Application ID</th>
                      <th>Submitted</th>
                      <th>Loan Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredApplications().map((app) => {
                      const statusInfo = getStatusBadge(app.status);
                      return (
                        <tr key={app.id} className="table-row-hover">
                          <td className="applicant-name-cell">
                            <div className="applicant-cell-content">
                              <div className="applicant-avatar-small">
                                {app.name.charAt(0)}
                              </div>
                              <div>
                                <div className="applicant-name-text">{app.name}</div>
                                <div className="applicant-email">{app.email || 'applicant@example.com'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="app-id-cell">
                            <span className="app-id-badge">{app.id}</span>
                          </td>
                          <td className="date-cell">
                            <span className="date-text">{app.submissionDate}</span>
                          </td>
                          <td className="amount-cell">
                            <span className="amount-text">{app.loanAmount}</span>
                          </td>
                          <td>
                            <span className={`status-badge-new ${statusInfo.class}`}>
                              <span className="status-icon">{statusInfo.icon}</span>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-view-details-table"
                              onClick={() => handleViewDetails(app.id)}
                            >
                              View Details
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
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
                  Showing <strong>{getFilteredApplications().length}</strong> of <strong>{allApplications.length}</strong> applications
                </span>
                <div className="pagination-buttons">
                  <button className="pagination-btn" disabled>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Previous
                  </button>
                  <div className="page-numbers">
                    <button className="page-number active">1</button>
                  </div>
                  <button className="pagination-btn" disabled>
                    Next
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
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