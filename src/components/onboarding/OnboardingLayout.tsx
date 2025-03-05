import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { tenantApi, profileApi, settingsApi } from "@/lib/api";

// Create a context to store onboarding data across steps
interface OnboardingContextType {
  tenantData: any;
  companyData: any;
  userData: any;
  preferencesData: any;
  updateTenantData: (data: any) => void;
  updateCompanyData: (data: any) => void;
  updateUserData: (data: any) => void;
  updatePreferencesData: (data: any) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  tenantData: {},
  companyData: {},
  userData: {},
  preferencesData: {},
  updateTenantData: () => {},
  updateCompanyData: () => {},
  updateUserData: () => {},
  updatePreferencesData: () => {},
});

// Hook to use the onboarding context
export const useOnboardingContext = () => useContext(OnboardingContext);

interface OnboardingLayoutProps {
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
}

const OnboardingLayout = ({
  totalSteps = 4,
  onNext = () => {},
  onPrevious = () => {},
  onComplete = () => {},
}: OnboardingLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current step based on URL
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("step1")) {
      setCurrentStep(1);
    } else if (path.includes("step2")) {
      setCurrentStep(2);
    } else if (path.includes("step3")) {
      setCurrentStep(3);
    } else if (path.includes("step4")) {
      setCurrentStep(4);
    } else {
      // Default to step 1 if no step is specified
      navigate("/onboarding/step1");
    }
  }, [location.pathname, navigate]);

  const progress = (currentStep / totalSteps) * 100;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  // State to store data from each step
  const [tenantData, setTenantData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [userData, setUserData] = useState({});
  const [preferencesData, setPreferencesData] = useState({});

  // This effect has been moved up to determine the current step

  const handleNext = async () => {
    if (isLastStep) {
      // Save all collected data to the appropriate tables
      try {
        // Get current user profile
        const currentProfile = await profileApi.getCurrent();
        if (!currentProfile) {
          throw new Error("Could not find current user profile");
        }

        // Get current tenant
        const currentTenant = await tenantApi.getCurrent();
        if (!currentTenant) {
          throw new Error("Could not find current tenant");
        }

        // 1. Update tenant information
        await tenantApi.update(currentTenant.id, {
          ...tenantData,
          ...companyData, // Add company details to tenant
        });

        // 2. Update user profile
        await profileApi.update(currentProfile.id, {
          first_name: userData.name ? userData.name.split(" ")[0] : "",
          last_name: userData.name
            ? userData.name.split(" ").slice(1).join(" ")
            : "",
          job_title: userData.jobTitle,
          phone: userData.phone,
          avatar_url: userData.avatarUrl,
          onboarding_complete: true,
        });

        // 3. Create or update settings
        await settingsApi.create({
          tenant_id: currentTenant.id,
          theme: preferencesData.theme || "light",
          email_notifications: preferencesData.emailNotifications,
          data_sharing: preferencesData.dataSharing,
          auto_save: preferencesData.autoSave,
        });

        console.log("All onboarding data saved successfully");
      } catch (error) {
        console.error("Error saving onboarding data:", error);
      }

      onComplete();
      navigate("/dashboard");
    } else {
      onNext();
      navigate(`/onboarding/step${currentStep + 1}`);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onPrevious();
      navigate(`/onboarding/step${currentStep - 1}`);
    }
  };

  // Memoize the update functions to prevent unnecessary re-renders
  const updateTenantData = React.useCallback((data: any) => {
    setTenantData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateCompanyData = React.useCallback((data: any) => {
    setCompanyData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateUserData = React.useCallback((data: any) => {
    setUserData((prev) => ({ ...prev, ...data }));
  }, []);

  const updatePreferencesData = React.useCallback((data: any) => {
    setPreferencesData((prev) => ({ ...prev, ...data }));
  }, []);

  // Context value
  const contextValue = React.useMemo(
    () => ({
      tenantData,
      companyData,
      userData,
      preferencesData,
      updateTenantData,
      updateCompanyData,
      updateUserData,
      updatePreferencesData,
    }),
    [
      tenantData,
      companyData,
      userData,
      preferencesData,
      updateTenantData,
      updateCompanyData,
      updateUserData,
      updatePreferencesData,
    ],
  );

  return (
    <OnboardingContext.Provider value={contextValue}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-3xl p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="py-4">
            <Outlet />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  Complete <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </OnboardingContext.Provider>
  );
};

export default OnboardingLayout;
