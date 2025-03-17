import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Loader2, RefreshCw, Mail, Phone, MapPin } from "lucide-react";
import { authApi, profileApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Supabase storage configuration
  const STORAGE_URL = "https://wvncqkxjfbtonfniybjg.supabase.co/storage/v1/s3";
  const BUCKET_NAME = "profiles";

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
    phone: "",
    address: "",
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

        // Get profile data using the user ID
        const currentProfile = await profileApi.getCurrent();
        if (!currentProfile) {
          throw new Error("Could not fetch profile data");
        }

        // Determine the avatar URL with proper fallbacks
        let avatarUrl = null;
        if (currentProfile.avatar_url && currentProfile.avatar_url !== "null") {
          avatarUrl = currentProfile.avatar_url;
        } else {
          // Use dicebear as fallback with the user's name as seed
          const nameSeed =
            currentProfile.first_name || user?.email?.split("@")[0] || "user";
          avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`;
        }

        // Parse additional details from bio field if they exist (stored as JSON)
        let extendedDetails = {
          birthDate: "",
          location: "",
          address: ""
        };
        
        try {
          if (currentProfile.bio && currentProfile.bio.startsWith('{')) {
            const bioData = JSON.parse(currentProfile.bio);
            if (bioData.extendedDetails) {
              extendedDetails = {
                ...extendedDetails,
                ...bioData.extendedDetails
              };
            }
          }
        } catch (e) {
          console.warn("Could not parse extended details from bio", e);
          // Bio isn't parseable JSON, just ignore and use defaults
        }
        
        // Extract actual bio text
        let bioText = currentProfile.bio || "";
        if (bioText.startsWith('{') && bioText.includes('"bioText":')) {
          try {
            const bioData = JSON.parse(bioText);
            bioText = bioData.bioText || "";
          } catch (e) {
            // If there's an error parsing, keep original bio text
          }
        }

        setProfile({
          id: currentProfile.id,
          firstName: currentProfile.first_name || "",
          lastName: currentProfile.last_name || "",
          username: user?.email?.split("@")[0] || "",
          bio: bioText,
          birthDate: extendedDetails.birthDate,
          location: extendedDetails.location,
          avatarUrl: avatarUrl,
          email: user?.email || "",
          phone: currentProfile.phone || "",
          address: extendedDetails.address,
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

  const generateNewAvatar = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Generate a unique seed for Dicebear avatar
      const nameSeed = `${profile.firstName || profile.email.split("@")[0] || "user"}_${Date.now()}`;
      const dicebearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`;

      // Update profile with Dicebear URL
      setProfile({ ...profile, avatarUrl: dicebearUrl });

      // Update the profile in the database with Dicebear URL
      const updated = await profileApi.update(profile.id, {
        avatar_url: dicebearUrl,
      });

      if (!updated) {
        throw new Error("Failed to update profile with avatar");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error generating new avatar:", error);
      setError("Failed to generate new avatar. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}_${uuidv4()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      setProfile({ ...profile, avatarUrl: publicUrl });

      // Update the profile in the database with the new avatar URL
      const updated = await profileApi.update(profile.id, {
        avatar_url: publicUrl,
        avatar_key: filePath,
      });

      if (!updated) {
        throw new Error("Failed to update profile with new avatar");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(error instanceof Error ? error.message : "Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Store additional profile details as JSON in the bio field
      const extendedDetails = {
        birthDate: profile.birthDate,
        location: profile.location,
        address: profile.address
      };
      
      const bioData = {
        bioText: profile.bio,
        extendedDetails: extendedDetails
      };
      
      // Prepare update data with only the fields that are actually used in the API
      const updateData = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: JSON.stringify(bioData),
        phone: profile.phone,
      };

      // Save profile changes using the API
      const updated = await profileApi.update(profile.id, updateData);

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
          <CardTitle>My Profile</CardTitle>
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
        <CardDescription>Manage your personal and contact information</CardDescription>
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
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={generateNewAvatar}
                  disabled={isSaving || isUploading}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New Avatar
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-medium">Personal Information</h3>
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
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!isEditing || isSaving}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    disabled={!isEditing || isSaving}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
