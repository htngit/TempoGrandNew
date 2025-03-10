import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, RefreshCw } from "lucide-react";
import { useOnboardingContext } from "./OnboardingLayout";
import { Button } from "@/components/ui/button";

interface UserDetailsProps {
  onDataChange?: (data: any) => void;
}

const UserDetails = ({ onDataChange = () => {} }: UserDetailsProps) => {
  const { userData, updateUserData } = useOnboardingContext();

  const [name, setName] = React.useState(userData.name || "");
  const [jobTitle, setJobTitle] = React.useState(userData.jobTitle || "");
  const [phone, setPhone] = React.useState(userData.phone || "");
  const [avatarUrl, setAvatarUrl] = React.useState(userData.avatarUrl || "");

  // Handle form changes manually instead of in useEffect
  const handleChange = React.useCallback(() => {
    const data = { name, jobTitle, phone, avatarUrl };
    updateUserData(data);
    onDataChange(data);
  }, [name, jobTitle, phone, avatarUrl, onDataChange, updateUserData]);

  // Use a debounced version of handleChange to avoid too many updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [handleChange]);

  const generateNewAvatar = () => {
    // Generate a unique seed for Dicebear avatar
    const nameSeed = `${name || "user"}_${Date.now()}`;
    const dicebearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`;
    console.log("Using Dicebear avatar URL:", dicebearUrl);
    setAvatarUrl(dicebearUrl);
  };

  // Generate an avatar if none exists
  React.useEffect(() => {
    if (!avatarUrl && name) {
      generateNewAvatar();
    }
  }, [name, avatarUrl]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your Details</h2>
          <p className="text-muted-foreground">Tell us more about yourself</p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-title">Job Title</Label>
          <Input
            id="job-title"
            placeholder="Enter your job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Profile Avatar</Label>
          <div className="flex flex-col items-center gap-4">
            {avatarUrl ? (
              <div className="mt-2 flex justify-center">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="h-20 w-20 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
                  }}
                />
              </div>
            ) : (
              <div className="mt-2 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewAvatar}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New Avatar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
