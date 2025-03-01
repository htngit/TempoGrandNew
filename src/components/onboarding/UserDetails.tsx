import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";

interface UserDetailsProps {
  onDataChange?: (data: any) => void;
}

const UserDetails = ({ onDataChange = () => {} }: UserDetailsProps) => {
  const [name, setName] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  React.useEffect(() => {
    onDataChange({ name, jobTitle, phone, avatarUrl });
  }, [name, jobTitle, phone, avatarUrl, onDataChange]);

  // Generate avatar URL based on name
  React.useEffect(() => {
    if (name) {
      setAvatarUrl(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      );
    }
  }, [name]);

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
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt="Profile" />
            <AvatarFallback>{name ? name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
          >
            <Upload className="h-4 w-4" />
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
