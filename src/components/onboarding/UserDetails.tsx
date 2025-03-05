import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useOnboardingContext } from "./OnboardingLayout";

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
          <Label htmlFor="avatar-url">Profile Picture URL</Label>
          <Input
            id="avatar-url"
            placeholder="Enter URL for your profile picture"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          {avatarUrl && (
            <div className="mt-2 flex justify-center">
              <img
                src={avatarUrl}
                alt="Profile Preview"
                className="h-20 w-20 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
