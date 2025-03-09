import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Loader2 } from "lucide-react";
import { profileApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    birthDate: "",
    location: "",
    avatarUrl: "",
    email: "",
    phone: "", // Added phone field
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user data for email first
        const { user, error: userError } = await authApi.getCurrentUser();
        if (userError || !user) {
          throw new Error("Could not fetch user data");
        }

        console.log("User ID from auth:", user.id);

        // Get profile data using the user ID
        const currentProfile = await profileApi.getCurrent();
        if (!currentProfile) {
          throw new Error("Could not fetch profile data");
        }

        // Verify the profile ID matches the user ID
        if (currentProfile.id !== user.id) {
          console.error("Profile ID doesn't match user ID", {
            profileId: currentProfile.id,
            userId: user.id,
          });
        }

        // User data already fetched above

        console.log("Current profile data:", currentProfile);

        // Determine the avatar URL with proper fallbacks
        let avatarUrl = null;
        if (currentProfile.avatar_url && currentProfile.avatar_url !== "null") {
          avatarUrl = currentProfile.avatar_url;
          console.log("Using avatar_url:", avatarUrl);
        } else if (
          currentProfile.avatar_url_s3 &&
          currentProfile.avatar_url_s3 !== "null"
        ) {
          avatarUrl = currentProfile.avatar_url_s3;
          console.log("Using avatar_url_s3:", avatarUrl);
        } else {
          // Use dicebear as fallback with the user's name as seed
          const nameSeed =
            currentProfile.first_name || user?.email?.split("@")[0] || "user";
          avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`;
          console.log("Using dicebear fallback:", avatarUrl);
        }

        // Log the profile ID to verify it's a valid UUID
        console.log("Profile ID:", currentProfile.id);

        setProfile({
          id: currentProfile.id,
          firstName: currentProfile.first_name || "",
          lastName: currentProfile.last_name || "",
          username: user?.email?.split("@")[0] || "",
          bio: currentProfile.bio || "",
          birthDate: currentProfile.birth_date || "",
          location: currentProfile.location || "",
          avatarUrl: avatarUrl,
          email: user?.email || "",
          phone: currentProfile.phone || "", // Added phone field
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      setError(null);

      // Create a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Error uploading file: " + uploadError.message);
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);

      // Update profile with new avatar URL
      setProfile({ ...profile, avatarUrl: publicUrl });

      // Update the profile in the database immediately
      await profileApi.update(profile.id, {
        avatar_url: publicUrl,
        avatar_url_s3: publicUrl, // Update both avatar fields for consistency
        avatar_key: filePath, // Store the storage key for future reference
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Save profile changes using the API
      const updated = await profileApi.update(profile.id, {
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
        birth_date: profile.birthDate,
        location: profile.location,
        phone: profile.phone, // Add phone field to update
      });

      if (!updated) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading profile data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Edit Profile"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.avatarUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
              />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  disabled={!isEditing || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  disabled={!isEditing || isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled={true} />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                disabled={!isEditing || isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                disabled={!isEditing || isSaving}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) =>
                    setProfile({ ...profile, birthDate: e.target.value })
                  }
                  disabled={!isEditing || isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  disabled={!isEditing || isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
