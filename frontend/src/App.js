import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import BankLogin from './subpages/BankLogin';
import UserLogin from './subpages/UserLogin';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import RiskConfiguration from './subpages/RiskConfiguration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bank-login" element={<BankLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/application-status" element={<ApplicationStatusPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/risk-configuration" element={<RiskConfiguration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
