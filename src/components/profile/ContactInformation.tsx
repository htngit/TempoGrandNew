import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { profileApi, authApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ContactInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileId, setProfileId] = useState("");

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user data for email
        const { user, error: userError } = await authApi.getCurrentUser();
        if (userError || !user) {
          throw new Error("Could not fetch user data");
        }

        console.log("User ID from auth (contact info):", user.id);

        // Get profile data for other contact info
        const currentProfile = await profileApi.getCurrent();
        if (!currentProfile) {
          throw new Error("Could not fetch profile data");
        }

        // Verify the profile ID matches the user ID
        if (currentProfile.id !== user.id) {
          console.error("Profile ID doesn't match user ID in contact info", {
            profileId: currentProfile.id,
            userId: user.id,
          });
        }

        setProfileId(currentProfile.id);
        console.log("Current profile data for contact info:", currentProfile);

        setContactInfo({
          email: user.email || "",
          phone: currentProfile.phone || "",
          address: currentProfile.address || "",
        });
      } catch (error) {
        console.error("Error fetching contact info:", error);
        setError("Failed to load contact information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Save contact info changes using the API
      const updated = await profileApi.update(profileId, {
        phone: contactInfo.phone,
        address: contactInfo.address,
      });

      if (!updated) {
        throw new Error("Failed to update contact information");
      }

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving contact info:", error);
      setError("Failed to save contact information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading contact information...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contact Information</CardTitle>
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
              "Edit Contact Info"
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
            <AlertDescription>
              Contact information updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="space-y-2 flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
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
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
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
                value={contactInfo.address}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, address: e.target.value })
                }
                disabled={!isEditing || isSaving}
                rows={3}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformation;
