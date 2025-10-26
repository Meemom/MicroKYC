import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1A2B4C"/>
              <path d="M16 12C14.9 12 14 12.9 14 14V18C14 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18V14C18 12.9 17.1 12 16 12Z" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">GigIT</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Mortgage Approval,<br />
          Reimagined for the<br />
          Gig Economy.
        </h1>
        <p className="hero-subtitle">
          GigIT securely automates income verification, connecting gig workers<br />
          with lenders for faster, fairer mortgage approvals.
        </p>

        {/* CTA Cards */}
        <div className="cta-cards">
          <div className="cta-card">
            <div className="card-icon card-icon-worker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#1A2B4C"/>
              </svg>
            </div>
            <h3 className="card-title">For Gig Workers</h3>
            <p className="card-description">
              Simplify your mortgage application and<br />
              prove your income easily.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>

          <div className="cta-card">
            <div className="card-icon card-icon-bank">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L2 8V9H22V8L12 3ZM4 11V19H6V11H4ZM10 11V19H12V11H10ZM16 11V19H18V11H16ZM2 21H22V23H2V21Z" fill="#1A2B4C"/>
              </svg>
            </div>
            <h3 className="card-title">For Bank Partners</h3>
            <p className="card-description">
              Reduce risk and automate verification<br />
              with reliable, real-time data.
            </p>
            <button className="btn btn-secondary">Partner Login</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-item">
          <h3 className="feature-title">Automated Income<br />Verification</h3>
        </div>
        <div className="feature-item">
          <h3 className="feature-title">Bank-Ready<br />Reports</h3>
        </div>
        <div className="feature-item">
          <h3 className="feature-title">Fairer<br />Assessments</h3>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust">
        <p className="trust-heading">SECURE, COMPLIANT, AND TRUSTED BY INDUSTRY LEADERS</p>
        <div className="trust-badges">
          <div className="badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 6V10C3 14.5 6.5 18 10 18C13.5 18 17 14.5 17 10V6L10 2Z" fill="#A9B1C2"/>
            </svg>
            <span>Bank-Level Security</span>
          </div>
          <div className="badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM8 14L4 10L5.41 8.59L8 11.17L14.59 4.58L16 6L8 14Z" fill="#A9B1C2"/>
            </svg>
            <span>SOC 2 Compliant</span>
          </div>
          <div className="badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 6V10C3 14.5 6.5 18 10 18C13.5 18 17 14.5 17 10V6L10 2ZM9 13H11V15H9V13ZM9 5H11V11H9V5Z" fill="#A9B1C2"/>
            </svg>
            <span>Data Encryption</span>
          </div>
          <div className="badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM8 14L4 10L5.41 8.59L8 11.17L14.59 4.58L16 6L8 14Z" fill="#A9B1C2"/>
            </svg>
            <span>Verified Partners</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;