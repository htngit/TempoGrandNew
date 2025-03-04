import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import TenantSetup from "./TenantSetup";
import CompanyDetails from "./CompanyDetails";
import UserDetails from "./UserDetails";
import Preferences from "./Preferences";

interface OnboardingLayoutProps {
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
}

const OnboardingLayout = ({
  currentStep = 1,
  totalSteps = 4,
  onNext = () => {},
  onPrevious = () => {},
  onComplete = () => {},
}: OnboardingLayoutProps) => {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = async () => {
    if (isLastStep) {
      // Mark onboarding as complete in the user's profile
      try {
        const { profileApi, authApi } = await import("@/lib/api");
        const { user } = await authApi.getCurrentUser();
        const currentProfile = await profileApi.getCurrent();

        if (currentProfile) {
          await profileApi.update(currentProfile.id, {
            onboarding_complete: true,
          });
          console.log("Onboarding marked as complete");
        } else if (user) {
          // If no profile exists but user exists, create a profile
          console.log("Creating new profile for user", user.id);
          // You may need to adjust this based on your profile structure
          await profileApi.update(user.id, {
            onboarding_complete: true,
            role: "member", // Default role
            tenant_id: user.id, // Temporary tenant ID, adjust as needed
          });
        } else {
          console.error("Could not find current user");
        }
      } catch (error) {
        console.error("Error updating onboarding status:", error);
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

  // Render the appropriate step component based on currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TenantSetup />;
      case 2:
        return <CompanyDetails />;
      case 3:
        return <UserDetails />;
      case 4:
        return <Preferences />;
      default:
        return <TenantSetup />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="py-4">{renderStepContent()}</div>

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
  );
};

export default OnboardingLayout;
