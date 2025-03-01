import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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

  const handleNext = () => {
    if (isLastStep) {
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
  );
};

export default OnboardingLayout;
