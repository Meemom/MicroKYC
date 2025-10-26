import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RiskConfiguration.css';

const RiskConfiguration = () => {
  const navigate = useNavigate();

  // Default weights (must add up to 100%)
  const defaultWeights = {
    incomeTrend: 30,
    incomeInconsistency: 30,
    documentAuthenticity: 20,
    paymentFrequency: 20
  };

  const [weights, setWeights] = useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('riskWeights');
    return saved ? JSON.parse(saved) : defaultWeights;
  });

  const [isDragging, setIsDragging] = useState(null);

  // Calculate total weight
  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);

  // Handle slider change
  const handleWeightChange = (criterion, value) => {
    const newValue = parseInt(value);
    const oldValue = weights[criterion];
    const difference = newValue - oldValue;

    // Adjust other weights proportionally
    const otherCriteria = Object.keys(weights).filter(key => key !== criterion);
    const otherTotal = otherCriteria.reduce((sum, key) => sum + weights[key], 0);

    if (otherTotal === 0 && difference !== 0) return; // Prevent division by zero

    const newWeights = { ...weights };
    newWeights[criterion] = newValue;

    // Distribute the difference among other criteria
    otherCriteria.forEach(key => {
      const proportion = weights[key] / otherTotal;
      newWeights[key] = Math.max(0, Math.round(weights[key] - (difference * proportion)));
    });

    // Ensure total is exactly 100
    const currentTotal = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
    if (currentTotal !== 100) {
      const adjustment = 100 - currentTotal;
      newWeights[otherCriteria[0]] += adjustment;
    }

    setWeights(newWeights);
  };

  const handleSave = () => {
    localStorage.setItem('riskWeights', JSON.stringify(weights));
    alert('Risk configuration saved successfully!');
  };

  const handleReset = () => {
    setWeights(defaultWeights);
    localStorage.removeItem('riskWeights');
  };

  // Criteria configuration
  const criteria = [
    {
      key: 'incomeTrend',
      label: 'Income Trend',
      description: 'Evaluates income growth or decline over time',
      color: '#10B981'
    },
    {
      key: 'incomeInconsistency',
      label: 'Income Inconsistency',
      description: 'Measures variability in income amounts',
      color: '#3B82F6'
    },
    {
      key: 'documentAuthenticity',
      label: 'Document Authenticity',
      description: 'Assesses the validity of submitted documents',
      color: '#8B5CF6'
    },
    {
      key: 'paymentFrequency',
      label: 'Payment Frequency',
      description: 'Analyzes regularity of income payments',
      color: '#F59E0B'
    }
  ];

  // Calculate donut chart segments
  const getDonutSegments = () => {
    let currentAngle = -90; // Start from top
    return criteria.map(criterion => {
      const percentage = weights[criterion.key];
      const angle = (percentage / 100) * 360;
      const segment = {
        color: criterion.color,
        percentage,
        startAngle: currentAngle,
        angle
      };
      currentAngle += angle;
      return segment;
    });
  };

  return (
    <div className="risk-config-page">
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
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
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
          <button className="nav-item active">
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
      <main className="risk-config-main">
        <div className="config-header">
          <h1 className="config-title">Customize Risk Score Weightage</h1>
          <p className="config-subtitle">
            Drag to reorder criteria or use the sliders to adjust their importance in the risk score calculation.
          </p>
        </div>

        <div className="config-grid">
          {/* Left Panel - Weighting Criteria */}
          <div className="criteria-panel">
            <h2 className="panel-title">Weighting Criteria</h2>
            
            <div className="criteria-list">
              {criteria.map((criterion) => (
                <div key={criterion.key} className="criterion-item">
                  <div className="criterion-header">
                    <div className="drag-handle">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="5" r="1.5" fill="#A9B1C2"/>
                        <circle cx="13" cy="5" r="1.5" fill="#A9B1C2"/>
                        <circle cx="7" cy="10" r="1.5" fill="#A9B1C2"/>
                        <circle cx="13" cy="10" r="1.5" fill="#A9B1C2"/>
                        <circle cx="7" cy="15" r="1.5" fill="#A9B1C2"/>
                        <circle cx="13" cy="15" r="1.5" fill="#A9B1C2"/>
                      </svg>
                    </div>
                    <div className="criterion-info">
                      <h3 className="criterion-label">{criterion.label}</h3>
                      <p className="criterion-description">{criterion.description}</p>
                    </div>
                  </div>

                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights[criterion.key]}
                      onChange={(e) => handleWeightChange(criterion.key, e.target.value)}
                      className="weight-slider"
                      style={{
                        background: `linear-gradient(to right, ${criterion.color} ${weights[criterion.key]}%, #E5E7EB ${weights[criterion.key]}%)`
                      }}
                    />
                    <span className="weight-value">{weights[criterion.key]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Weight Distribution */}
          <div className="distribution-panel">
            <h2 className="panel-title">Weight Distribution</h2>
            
            <div className="donut-chart-container">
              <svg className="donut-chart" viewBox="0 0 200 200">
                {getDonutSegments().map((segment, index) => {
                  const radius = 70;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                  const rotation = segment.startAngle;

                  return (
                    <circle
                      key={index}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="30"
                      strokeDasharray={strokeDasharray}
                      transform={`rotate(${rotation} 100 100)`}
                      className="donut-segment"
                    />
                  );
                })}
                <text x="100" y="95" textAnchor="middle" className="donut-percentage">
                  {totalWeight}%
                </text>
                <text x="100" y="115" textAnchor="middle" className="donut-label">
                  Total Weight
                </text>
              </svg>
            </div>

            <div className="legend">
              {criteria.map((criterion) => (
                <div key={criterion.key} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: criterion.color }}></div>
                  <span className="legend-label">{criterion.label}</span>
                  <span className="legend-value">{weights[criterion.key]}%</span>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn-reset" onClick={handleReset}>
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskConfiguration;
