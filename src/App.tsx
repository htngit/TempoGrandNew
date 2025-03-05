import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import DashboardHome from "./components/dashboard/DashboardHome";
import ContactsPage from "./components/contacts/ContactsPage";
import SettingsPage from "./components/settings/SettingsPage";
import LeadManagementTable from "./components/leads/LeadManagementTable";
import OnboardingLayout from "./components/onboarding/OnboardingLayout";
import TenantSetup from "./components/onboarding/TenantSetup";
import CompanyDetails from "./components/onboarding/CompanyDetails";
import UserDetails from "./components/onboarding/UserDetails";
import Preferences from "./components/onboarding/Preferences";
import LandingPage from "./components/landing/LandingPage";
import routes from "tempo-routes";

function App() {
  // This would normally come from your auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Login process is now handled by the LoginPage component directly
  // This function is kept for backward compatibility
  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt with", { email, password });
    setIsAuthenticated(true);

    // The actual redirect logic is now in the LoginPage component
    // based on the user's onboarding_complete flag in their profile
    return;
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Landing Page as default route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Onboarding Flow */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route path="step1" element={<TenantSetup />} />
            <Route path="step2" element={<CompanyDetails />} />
            <Route path="step3" element={<UserDetails />} />
            <Route path="step4" element={<Preferences />} />
          </Route>

          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Home />}>
            <Route index element={<DashboardHome />} />
            <Route path="leads" element={<LeadManagementTable />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Tempo routes for storyboards */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
