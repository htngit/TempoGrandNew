import { Suspense, useState, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import { authApi } from "./lib/api";

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await authApi.getCurrentUser();
        if (user && !error) {
          setIsAuthenticated(true);
        } else {
          // Redirect to login if not authenticated
          navigate("/login", { state: { from: location.pathname } });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login", { state: { from: location.pathname } });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  // This would normally come from your auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { user, error } = await authApi.getCurrentUser();
      setIsAuthenticated(!!user && !error);
    };

    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await authApi.signOut();
      if (!error) {
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Simulate login process
  const handleLogin = async (email: string, password: string) => {
    try {
      // In a real app, you would validate credentials with your backend
      console.log("Login attempt with", { email, password });
      const { user, profile, error } = await authApi.signIn(email, password);

      if (error || !user) {
        console.error("Login failed:", error);
        return null;
      }

      setIsAuthenticated(true);

      // Check if this is the user's first login
      if (profile && profile.onboarding_complete === false) {
        setIsFirstLogin(true);
        return "/onboarding/step1";
      } else if (!profile) {
        // If profile is null, it might be a new user without a profile yet
        console.log("No profile found, redirecting to onboarding");
        setIsFirstLogin(true);
        return "/onboarding/step1";
      } else {
        setIsFirstLogin(false);
        return "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
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

          {/* Onboarding Flow - Protected */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step1"
            element={
              <ProtectedRoute>
                <OnboardingLayout currentStep={1} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step2"
            element={
              <ProtectedRoute>
                <OnboardingLayout currentStep={2} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step3"
            element={
              <ProtectedRoute>
                <OnboardingLayout currentStep={3} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step4"
            element={
              <ProtectedRoute>
                <OnboardingLayout currentStep={4} />
              </ProtectedRoute>
            }
          />

          {/* Main Dashboard - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="leads" element={<LeadManagementTable />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Tempo routes for storyboards */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && routes && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
