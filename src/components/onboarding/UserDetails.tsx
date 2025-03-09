import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useOnboardingContext } from "./OnboardingLayout";
import { supabase } from "@/lib/supabase";

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
          <Label htmlFor="avatar-upload">Profile Picture</Label>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  // Create a unique file path
                  const fileExt = file.name.split(".").pop();
                  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                  const filePath = `avatars/${fileName}`;

                  // Upload the file to Supabase Storage
                  const { error: uploadError, data } = await supabase.storage
                    .from("profiles")
                    .upload(filePath, file);

                  if (uploadError) {
                    console.error("Error uploading file:", uploadError);
                    return;
                  }

                  // Get the public URL
                  const {
                    data: { publicUrl },
                  } = supabase.storage.from("profiles").getPublicUrl(filePath);

                  setAvatarUrl(publicUrl);
                } catch (error) {
                  console.error("Error in file upload:", error);
                }
              }}
            />
          </div>
          {avatarUrl ? (
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
          ) : (
            <div className="mt-2 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
