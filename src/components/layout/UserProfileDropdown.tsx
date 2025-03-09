import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { profileApi } from "@/lib/api";

interface UserProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
}

const UserProfileDropdown = ({
  user: initialUser,
  onLogout,
  onSettings = () => console.log("settings clicked"),
  onProfile = () => console.log("profile clicked"),
}: UserProfileDropdownProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Get user data for email
        const { user: authUser, error: userError } =
          await authApi.getCurrentUser();
        if (userError || !authUser) {
          throw new Error("User not found or not logged in");
        }

        console.log("User ID from auth (dropdown):", authUser.id);

        // Get profile data for name and avatar
        const profile = await profileApi.getCurrent();

        // Verify profile data if available
        if (profile && profile.id !== authUser.id) {
          console.error("Profile ID doesn't match user ID in dropdown", {
            profileId: profile.id,
            userId: authUser.id,
          });
        }

        // Get the user's full name from profile data
        const fullName = profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
          : authUser.email?.split("@")[0] || "User";

        console.log("Profile data for dropdown:", profile);

        // Determine the avatar URL with proper fallbacks
        let avatarUrl = null;
        if (profile?.avatar_url && profile.avatar_url !== "null") {
          avatarUrl = profile.avatar_url;
          console.log("Dropdown using avatar_url:", avatarUrl);
        } else if (profile?.avatar_url_s3 && profile.avatar_url_s3 !== "null") {
          avatarUrl = profile.avatar_url_s3;
          console.log("Dropdown using avatar_url_s3:", avatarUrl);
        } else {
          // Use dicebear as fallback with the user's name as seed
          const nameSeed =
            profile?.first_name || authUser.email?.split("@")[0] || "user";
          avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`;
          console.log("Dropdown using dicebear fallback:", avatarUrl);
        }

        setUser({
          name: fullName,
          email: authUser.email || "",
          avatarUrl: avatarUrl,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to initial user if provided, or default values
        if (initialUser) {
          setUser(initialUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      // Call the custom onLogout if provided
      if (onLogout) {
        onLogout();
      }

      // Sign out using the auth API
      const { error } = await authApi.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      console.log("User logged out successfully");

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect to login page even if there's an error
      navigate("/login");
    }
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
  };

  if (isLoading) {
    return (
      <div className="bg-background p-2 rounded-lg">
        <Button
          variant="ghost"
          className="relative h-10 w-full flex items-center justify-start gap-2 px-2"
          disabled
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2">Loading...</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background p-2 rounded-lg">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-full flex items-center justify-start gap-2 px-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown;
