import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload, Loader2 } from "lucide-react";
import { storageApi } from "@/lib/storage";
import { authApi, profileApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface UserDetailsProps {
  onDataChange?: (data: any) => void;
}

const UserDetails = ({ onDataChange = () => {} }: UserDetailsProps) => {
  const [name, setName] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [avatarKey, setAvatarKey] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    onDataChange({ name, jobTitle, phone, avatarUrl, avatarKey });
  }, [name, jobTitle, phone, avatarUrl, avatarKey, onDataChange]);

  // Generate avatar URL based on name if no custom avatar
  React.useEffect(() => {
    if (name && !avatarUrl) {
      setAvatarUrl(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      );
    }
  }, [name, avatarUrl]);

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Get current user
      const { user, error: userError } = await authApi.getCurrentUser();
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload a profile picture",
          variant: "destructive",
        });
        return;
      }

      // Upload file to storage
      const { url, key, error } = await storageApi.uploadProfilePicture(
        user.id,
        file,
      );

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message || "Could not upload profile picture",
          variant: "destructive",
        });
        return;
      }

      if (url) {
        setAvatarUrl(url);
        setAvatarKey(key || "");

        // Update profile if it exists
        const profile = await profileApi.getCurrent();
        if (profile) {
          await profileApi.update(profile.id, {
            avatar_url: url,
            avatar_key: key,
          });
        }

        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <p className="text-muted-foreground">Tell us about yourself</p>
        </div>
      </div>

      <div className="flex justify-center my-6">
        <div className="relative">
          <Avatar
            className="h-24 w-24 cursor-pointer"
            onClick={handleAvatarClick}
          >
            <AvatarImage src={avatarUrl} alt="Profile" />
            <AvatarFallback>{name ? name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
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
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
