import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from '../services/ApplicationService';
import './VerifyPage.css';
import BackendAPIService from '../services/BackendAPIService';

const VerifyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    ssn: '',
    dateOfBirth: '',
    platforms: [],
    monthlyIncome: '',
    workDuration: '',
    gigWorkDocs: [],
    financialDocs: []
  });
  const [errors, setErrors] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Gig Work' },
    { number: 3, label: 'Financials' },
    { number: 4, label: 'Review' },
  ];

  // Available banks
  const availableBanks = [
    { id: 'BANK001', name: 'Chase Bank' },
    { id: 'BANK002', name: 'Wells Fargo' },
    { id: 'BANK003', name: 'Bank of America' },
    { id: 'BANK004', name: 'Citibank' },
    { id: 'BANK005', name: 'US Bank' },
    { id: 'BANK006', name: 'PNC Bank' }
  ];

  const gigPlatforms = [
    { id: 'uber', name: 'Uber', icon: '🚗' },
    { id: 'lyft', name: 'Lyft', icon: '🚕' },
    { id: 'doordash', name: 'DoorDash', icon: '🍔' },
    { id: 'ubereats', name: 'Uber Eats', icon: '🍕' },
    { id: 'instacart', name: 'Instacart', icon: '🛒' },
    { id: 'upwork', name: 'Upwork', icon: '💼' },
    { id: 'fiverr', name: 'Fiverr', icon: '🎨' },
    { id: 'other', name: 'Other', icon: '📱' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePlatformToggle = (platformId) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const validateSSN = (ssn) => {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(ssn);
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF, PNG, and JPG files are allowed' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }
    return { valid: true };
  };

  const handleFileUpload = async (e, category) => {
    const files = Array.from(e.target.files);
    const validatedFiles = [];
    const fileErrors = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        fileErrors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        // Send to backend
        const result = await BackendAPIService.verifyGigWorkerDocument(file);

        validatedFiles.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          status: 'verified',
          verificationData: result,  // store backend results
          file: file
        });
      } catch (error) {
        fileErrors.push(`${file.name}: ${error.message}`);
      }
    }

    if (fileErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        [category]: fileErrors.join(', ')
      }));
    }

    if (validatedFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        [category]: [...prev[category], ...validatedFiles]
      }));
    }
  };


  const handleNextStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.bankId) newErrors.bankId = 'Please select a bank'; // NEW: Bank ID validation
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

    if (currentStep === 2) {
      if (formData.platforms.length === 0) {
        newErrors.platforms = 'Please select at least one platform';
      }
      if (!formData.monthlyIncome) {
        newErrors.monthlyIncome = 'Monthly income is required';
      }
      if (!formData.workDuration) {
        newErrors.workDuration = 'Work duration is required';
      }
      if (formData.gigWorkDocs.length === 0) {
        newErrors.gigWorkDocs = 'Please upload at least one document';
      }
    }

    if (currentStep === 3) {
      if (formData.financialDocs.length === 0) {
        newErrors.financialDocs = 'Please upload at least one financial document';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    const applicationData = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
  
    const existing = JSON.parse(localStorage.getItem('applications') || '[]');
    existing.push(applicationData);
    localStorage.setItem('applications', JSON.stringify(existing));
  
    alert(`✅ Application submitted successfully!`);
  
    setIsSubmitting(false);
    navigate('/user-login'); // or your dashboard page
  };  

  const handleRemoveFile = (category, fileId) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter(file => file.id !== fileId)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  

  return (
    <div className="verify-page">
      {/* Submission Overlay */}
      {isSubmitting && (
        <div className="submission-overlay">
          <div className="submission-modal">
            <div className="spinner-large"></div>
            <h2>Submitting Your Application...</h2>
            <p>Please wait while we process your information</p>
          </div>
        </div>
      )}

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

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-section">
              <h2 className="section-title">1. Personal Information</h2>
              <p className="section-subtitle">Please provide your personal details as they appear on your official documents.</p>

              <div className="form-grid">
                {/* Bank Selection - NEW */}
                <div className="form-group full-width bank-selection">
                  <label htmlFor="bankId">Select Your Bank *</label>
                  <select
                    id="bankId"
                    name="bankId"
                    value={formData.bankId}
                    onChange={handleInputChange}
                    className={errors.bankId ? 'error' : ''}
                  >
                    <option value="">Choose a bank...</option>
                    {availableBanks.map(bank => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name} (ID: {bank.id})
                      </option>
                    ))}
                  </select>
                  <p className="field-helper">Your application will be sent to this bank for review</p>
                  {errors.bankId && <span className="error-message">{errors.bankId}</span>}
                </div>

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
                  <label htmlFor="ssn">Social Security Number</label>
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
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Gig Work */}
          {currentStep === 2 && (
            <div className="form-section">
              <h2 className="section-title">2. Gig Work Information</h2>
              <p className="section-subtitle">Tell us about your gig work and income sources.</p>

              <div className="form-content">
                <div className="form-group full-width">
                  <label>Select Your Platforms</label>
                  <div className="platforms-grid">
                    {gigPlatforms.map(platform => (
                      <button
                        key={platform.id}
                        type="button"
                        className={`platform-card ${formData.platforms.includes(platform.id) ? 'selected' : ''}`}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <span className="platform-icon">{platform.icon}</span>
                        <span className="platform-name">{platform.name}</span>
                        {formData.platforms.includes(platform.id) && (
                          <span className="check-icon">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.platforms && <span className="error-message">{errors.platforms}</span>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="monthlyIncome">Average Monthly Income</label>
                    <input
                      type="number"
                      id="monthlyIncome"
                      name="monthlyIncome"
                      placeholder="e.g., 5000"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      className={errors.monthlyIncome ? 'error' : ''}
                    />
                    {errors.monthlyIncome && <span className="error-message">{errors.monthlyIncome}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="workDuration">How long have you been working?</label>
                    <select
                      id="workDuration"
                      name="workDuration"
                      value={formData.workDuration}
                      onChange={handleInputChange}
                      className={errors.workDuration ? 'error' : ''}
                    >
                      <option value="">Select duration</option>
                      <option value="less-than-6">Less than 6 months</option>
                      <option value="6-12">6-12 months</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                    {errors.workDuration && <span className="error-message">{errors.workDuration}</span>}
                  </div>
                </div>

                <div className="upload-section">
                  <h3 className="upload-title">Upload Income Documents</h3>
                  <p className="upload-subtitle">Upload screenshots or PDFs from your gig platforms (earnings summaries, 1099 forms, etc.)</p>
                  
                  <label className="file-upload-box">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'gigWorkDocs')}
                      style={{ display: 'none' }}
                    />
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 8V32M24 32L16 24M24 32L32 24" stroke="#1976D2" strokeWidth="3" strokeLinecap="round"/>
                      <rect x="8" y="36" width="32" height="4" fill="#1976D2" opacity="0.2"/>
                    </svg>
                    <span>Click to upload or drag and drop</span>
                    <span className="file-types">PDF, PNG, JPG (max 10MB each)</span>
                  </label>
                  {errors.gigWorkDocs && <span className="error-message">{errors.gigWorkDocs}</span>}

                  {formData.gigWorkDocs.length > 0 && (
                    <div className="uploaded-files">
                      {formData.gigWorkDocs.map(file => (
                        <div key={file.id} className="file-item-compact">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#10B981" opacity="0.2"/>
                            <path d="M14 2V8H20" stroke="#10B981" strokeWidth="2"/>
                          </svg>
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                          <span className="file-status">✓ Verified</span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('gigWorkDocs', file.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Documents */}
          {currentStep === 3 && (
            <div className="form-section">
              <h2 className="section-title">3. Financial Information</h2>
              <p className="section-subtitle">Upload bank statements and tax documents for income verification.</p>

              <div className="form-content">
                <div className="upload-section">
                  <h3 className="upload-title">Upload Financial Documents</h3>
                  <p className="upload-subtitle">Please upload bank statements (last 3 months) and tax returns (most recent year)</p>
                  
                  <label className="file-upload-box">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'financialDocs')}
                      style={{ display: 'none' }}
                    />
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 8V32M24 32L16 24M24 32L32 24" stroke="#1976D2" strokeWidth="3" strokeLinecap="round"/>
                      <rect x="8" y="36" width="32" height="4" fill="#1976D2" opacity="0.2"/>
                    </svg>
                    <span>Click to upload or drag and drop</span>
                    <span className="file-types">PDF, PNG, JPG (max 10MB each)</span>
                  </label>
                  {errors.financialDocs && <span className="error-message">{errors.financialDocs}</span>}

                  <div className="doc-categories">
                    <div className="doc-category">
                      <h4>📊 Bank Statements</h4>
                      <p>Last 3 months of statements</p>
                    </div>
                    <div className="doc-category">
                      <h4>📋 Tax Returns</h4>
                      <p>Most recent year (2023 or 2024)</p>
                    </div>
                    <div className="doc-category">
                      <h4>📄 1099 Forms</h4>
                      <p>All gig platform 1099s</p>
                    </div>
                  </div>

                  {formData.financialDocs.length > 0 && (
                    <div className="uploaded-files">
                      {formData.financialDocs.map(file => (
                        <div key={file.id} className="file-item-compact">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3B82F6" opacity="0.2"/>
                            <path d="M14 2V8H20" stroke="#3B82F6" strokeWidth="2"/>
                          </svg>
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                          <span className="file-status">✓ Verified</span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('financialDocs', file.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="form-section">
              <h2 className="section-title">4. Review & Submit</h2>
              <p className="section-subtitle">Please review your information before submitting your application.</p>

              <div className="review-sections">
                <div className="review-section">
                  <h3 className="review-section-title">Personal Information</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Selected Bank</span>
                      <span className="review-value">
                        {availableBanks.find(b => b.id === formData.bankId)?.name || 'Not selected'} 
                        {formData.bankId && ` (${formData.bankId})`}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Full Name</span>
                      <span className="review-value">{formData.fullName}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Email</span>
                      <span className="review-value">{formData.email}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Phone</span>
                      <span className="review-value">{formData.phone}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Address</span>
                      <span className="review-value">{formData.address}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">SSN</span>
                      <span className="review-value">{formData.ssn}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Date of Birth</span>
                      <span className="review-value">{formData.dateOfBirth}</span>
                    </div>
                  </div>
                  <button className="edit-btn" onClick={() => setCurrentStep(1)}>Edit</button>
                </div>

                <div className="review-section">
                  <h3 className="review-section-title">Gig Work Information</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Platforms</span>
                      <span className="review-value">
                        {formData.platforms.map(id => 
                          gigPlatforms.find(p => p.id === id)?.name
                        ).join(', ')}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Monthly Income</span>
                      <span className="review-value">${formData.monthlyIncome}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Work Duration</span>
                      <span className="review-value">{formData.workDuration}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Documents Uploaded</span>
                      <span className="review-value">{formData.gigWorkDocs.length} file(s)</span>
                    </div>
                  </div>
                  <button className="edit-btn" onClick={() => setCurrentStep(2)}>Edit</button>
                </div>

                <div className="review-section">
                  <h3 className="review-section-title">Financial Documents</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Documents Uploaded</span>
                      <span className="review-value">{formData.financialDocs.length} file(s)</span>
                    </div>
                  </div>
                  <div className="review-files-list">
                    <h4>Gig Work Documents:</h4>
                    <ul>
                      {formData.gigWorkDocs.map(file => (
                        <li key={file.id}>📄 {file.name}</li>
                      ))}
                    </ul>
                    <h4>Financial Documents:</h4>
                    <ul>
                      {formData.financialDocs.map(file => (
                        <li key={file.id}>📄 {file.name}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="edit-btn" onClick={() => setCurrentStep(3)}>Edit</button>
                </div>

                <div className="confirmation-box">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>I confirm that all information provided is accurate and complete</span>
                  </label>
                </div>
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
                disabled={currentStep === 1 || isSubmitting}
              >
                Back
              </button>
              <button 
                className="btn-next" 
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : (currentStep === 4 ? 'Submit Application' : 'Next Step')}
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

            {currentStep === 1 && (
              <div className="tip-section">
                <h4>Why Select a Bank?</h4>
                <p>Your application will be sent directly to the bank you select. Make sure to choose the bank you'd like to work with for your mortgage.</p>
                <h4 style={{marginTop: '16px'}}>Why we ask for this</h4>
                <p>We use your personal information to verify your identity and comply with federal regulations. Your data is encrypted and secure.</p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="tip-section">
                <h4>Demo Documents for Gig Work</h4>
                <ul className="demo-docs-list">
                  <li>📄 Uber earnings summary (PDF)</li>
                  <li>📄 DoorDash weekly report (PNG)</li>
                  <li>📄 1099-K form (PDF)</li>
                </ul>
                <p className="tip-note">Upload any PDF or image file for demo purposes</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="tip-section">
                <h4>Demo Documents for Financials</h4>
                <ul className="demo-docs-list">
                  <li>📊 Bank statement - October 2024</li>
                  <li>📊 Bank statement - September 2024</li>
                  <li>📋 Tax return 2023 (Form 1040)</li>
                </ul>
                <p className="tip-note">Upload any PDF or image file for demo purposes</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="tip-section">
                <h4>Final Steps</h4>
                <p>Review all information carefully before submitting. You can go back to edit any section if needed.</p>
              </div>
            )}

            <div className="tip-section">
              <h4>Need Help?</h4>
              <button className="support-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13.5V16.5C18 17.05 17.55 17.5 17 17.5H6L2 21.5V4.5C2 3.95 2.45 3.5 3 3.5H11" stroke="#1976D2" strokeWidth="1.5" strokeLinecap="round"/>
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
