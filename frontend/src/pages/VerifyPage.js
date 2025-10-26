import React, { useState } from 'react';
import './VerifyPage.css';

const VerifyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    ssn: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Gig Work' },
    { number: 3, label: 'Financials' },
    { number: 4, label: 'Review' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateSSN = (ssn) => {
    // Basic SSN validation (9 digits)
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(ssn);
  };

  const handleNextStep = () => {
    // Validate current step
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.ssn) {
        newErrors.ssn = 'Please enter a valid SSN.';
      } else if (!validateSSN(formData.ssn)) {
        newErrors.ssn = 'Please enter a valid SSN.';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="verify-page">
      {/* Header */}
      <header className="verify-header">
        <div className="verify-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L4 10V16C4 23 10 28 16 28C22 28 28 23 28 16V10L16 4Z" fill="#1A2B4C"/>
          </svg>
          <span className="verify-logo-text">GigIT</span>
        </div>
        <div className="verify-actions">
          <button className="save-exit-btn">Save & Exit</button>
          <button className="user-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#A9B1C2"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="verify-container">
        <div className="verify-content">
          {/* Page Title */}
          <h1 className="page-title">Mortgage Application</h1>

          {/* Progress Steps */}
          <div className="progress-steps">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}>
                  <div className="step-circle">
                    {currentStep > step.number ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11L3 8L4.4 6.6L6 8.2L11.6 2.6L13 4L6 11Z" fill="white"/>
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {index < steps.length - 1 && <div className={`step-line ${currentStep > step.number ? 'active' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Form Content - Step 1 */}
          {currentStep === 1 && (
            <div className="form-section">
              <h2 className="section-title">1. Personal Information</h2>
              <p className="section-subtitle">Please provide your personal details as they appear on your official documents.</p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="e.g., Jane Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Current Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Main Street, Anytown, USA"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ssn">
                    Social Security Number
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#A9B1C2" strokeWidth="1.5"/>
                      <path d="M8 10.6667V8M8 5.33333H8.00667" stroke="#A9B1C2" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </label>
                  <input
                    type="text"
                    id="ssn"
                    name="ssn"
                    placeholder="***-**-****"
                    value={formData.ssn}
                    onChange={handleInputChange}
                    className={errors.ssn ? 'error' : ''}
                  />
                  {errors.ssn && <span className="error-message">{errors.ssn}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    placeholder="mm/dd/yyyy"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other steps */}
          {currentStep === 2 && (
            <div className="form-section">
              <h2 className="section-title">2. Gig Work Information</h2>
              <p className="section-subtitle">Tell us about your gig work and income sources.</p>
              <div className="coming-soon">
                <p>This section will include platform selection, income details, and work history.</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-section">
              <h2 className="section-title">3. Financial Information</h2>
              <p className="section-subtitle">Provide your financial details for income verification.</p>
              <div className="coming-soon">
                <p>This section will include bank statements, tax documents, and financial summaries.</p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-section">
              <h2 className="section-title">4. Review & Submit</h2>
              <p className="section-subtitle">Review your information before submitting your application.</p>
              <div className="coming-soon">
                <p>This section will show a summary of all entered information for final review.</p>
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="form-footer">
            <div className="auto-saved">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#A9B1C2" strokeWidth="1.5"/>
                <path d="M8 4V8L10.5 9.5" stroke="#A9B1C2" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Auto-saved</span>
            </div>
            <div className="nav-buttons">
              <button 
                className="btn-back" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </button>
              <button className="btn-next" onClick={handleNextStep}>
                {currentStep === 4 ? 'Submit' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="verify-sidebar">
          <div className="tips-card">
            <div className="tips-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4A9FE8"/>
              </svg>
              <h3>Tips for Gig Workers</h3>
            </div>

            <div className="tip-section">
              <h4>Why we ask for this</h4>
              <p>We use your personal information to verify your identity and comply with federal regulations. Your data is encrypted and secure.</p>
            </div>

            <div className="tip-section">
              <h4>How to calculate your average income</h4>
              <p>In the next step, you'll be asked for your gig income. Gather your last 12 months of earnings from each platform to calculate a monthly average.</p>
            </div>

            <div className="tip-section">
              <h4>Need Help?</h4>
              <button className="support-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13.5V16.5C18 17.05 17.55 17.5 17 17.5H6L2 21.5V4.5C2 3.95 2.45 3.5 3 3.5H11" stroke="#1976D2" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15 2H21M18 5V-1" stroke="#1976D2" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Chat with Support
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VerifyPage;
