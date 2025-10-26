import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import BankLogin from './subpages/BankLogin';
import UserLogin from './subpages/UserLogin';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import RiskConfiguration from './subpages/RiskConfiguration';
import BusinessSettings from './subpages/BusinessSettings';
import ApplicationSuccess from './subpages/ApplicationSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bank-login" element={<BankLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/application-results" element={<ApplicationStatusPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/risk-configuration" element={<RiskConfiguration />} />
        <Route path="/settings" element={<BusinessSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
