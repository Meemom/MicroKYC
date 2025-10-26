// ApplicationService.js - Service to handle application submissions

// Helper function to calculate loan amount
const calculateLoanAmount = (monthlyIncome) => {
  const annual = parseFloat(monthlyIncome) * 12;
  const loanAmount = annual * 3.5;
  return `$${Math.round(loanAmount).toLocaleString()}`;
};

// Helper function to add to action required list
const addToActionRequired = (application) => {
  const actionRequired = JSON.parse(localStorage.getItem('actionRequiredApps') || '[]');
  
  actionRequired.push({
    id: application.id,
    name: application.name,
    status: 'Awaiting Review',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    bankId: application.bankId // Include bank ID
  });
  
  localStorage.setItem('actionRequiredApps', JSON.stringify(actionRequired));
};

const ApplicationService = {
  // Submit a new application
  submitApplication: (formData) => {
    // Get existing applications from localStorage
    const existingApps = JSON.parse(localStorage.getItem('allApplications') || '[]');
    
    // Create new application with generated ID
    const newApplication = {
      id: `APP-${Date.now()}`,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      ssn: formData.ssn,
      dateOfBirth: formData.dateOfBirth,
      bankId: formData.bankId, // Store bank ID
      platforms: formData.platforms,
      monthlyIncome: formData.monthlyIncome,
      workDuration: formData.workDuration,
      gigWorkDocs: formData.gigWorkDocs.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type
      })),
      financialDocs: formData.financialDocs.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type
      })),
      submissionDate: new Date().toISOString().split('T')[0],
      loanAmount: calculateLoanAmount(formData.monthlyIncome),
      status: 'pending', // Initial status
      riskScore: null,
      submittedAt: new Date().toISOString()
    };

    // Add to applications list
    existingApps.push(newApplication);
    
    // Save back to localStorage
    localStorage.setItem('allApplications', JSON.stringify(existingApps));
    
    // Also add to action required (for bank attention)
    addToActionRequired(newApplication);
    
    return newApplication;
  },

  // Get all applications (optionally filter by bank ID)
  getAllApplications: (bankId = null) => {
    const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]');
    
    // If bankId provided, filter applications for that bank only
    if (bankId) {
      return allApps.filter(app => app.bankId === bankId);
    }
    
    return allApps;
  },

  // Get action required applications (optionally filter by bank ID)
  getActionRequired: (bankId = null) => {
    const actionApps = JSON.parse(localStorage.getItem('actionRequiredApps') || '[]');
    
    // If bankId provided, filter applications for that bank only
    if (bankId) {
      return actionApps.filter(app => app.bankId === bankId);
    }
    
    return actionApps;
  },

  // Update application status
  updateApplicationStatus: (appId, newStatus) => {
    const applications = JSON.parse(localStorage.getItem('allApplications') || '[]');
    const updatedApps = applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    );
    localStorage.setItem('allApplications', JSON.stringify(updatedApps));
  }
};

export default ApplicationService;