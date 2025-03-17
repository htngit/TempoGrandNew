import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  AlertCircle,
  Mail,
  Loader2,
  UserPlus,
  UserCheck,
  UserX,
  ShieldAlert,
  Shield,
  Eye,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { profileApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  status?: string;
  avatar_url?: string | null;
  tenant_id: string;
  created_at: string | null;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  staff: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  invited: "bg-yellow-100 text-yellow-800",
  inactive: "bg-red-100 text-red-800",
};

const RoleIcon = ({ role }: { role: string }) => {
  switch (role) {
    case "admin":
      return <ShieldAlert className="h-4 w-4 mr-2" />;
    case "staff":
      return <Shield className="h-4 w-4 mr-2" />;
    case "viewer":
      return <Eye className="h-4 w-4 mr-2" />;
    default:
      return null;
  }
};

// Component to display when user is not the owner
const NotOwnerMessage = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-yellow-100">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium">User Management Restricted</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Only the tenant owner (original account creator) can manage users. 
            If you need to add or modify team members, please contact your administrator.
          </p>
        </div>
      </div>
    </Card>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch users and check if current user is owner
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if current user is owner
        const ownerStatus = await profileApi.isOwner();
        setIsOwner(ownerStatus);

        // Fetch all users for the tenant
        const allUsers = await profileApi.getAll();
        
        // Fetch current user data for reference
        const currentProfile = await profileApi.getCurrent();
        if (!currentProfile) throw new Error("Failed to get current user");
        
        // Convert to our User interface format - generate email from the profile data if possible
        const formattedUsers = allUsers.map(user => {
          // Extract email domain from current user if available 
          const emailDomain = currentProfile && currentProfile.tenant_id 
            ? currentProfile.tenant_id.split('-')[0] + '.com' // Simple fallback
            : 'company.com';
            
          // Generate an email based on name or use a placeholder
          const generatedEmail = user.first_name && user.last_name 
            ? `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@${emailDomain}`
            : `user_${user.id.substring(0, 8)}@${emailDomain}`;
          
          // Determine if this is an invited user by checking for presence of a user ID format
          // In real app, you'd have a proper status field
          const isInvitedUser = user.id.startsWith('invite_');
          
          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: generatedEmail, // Use generated email
            role: user.role,
            status: isInvitedUser ? 'invited' : 'active',
            avatar_url: user.avatar_url,
            tenant_id: user.tenant_id,
            created_at: user.created_at
          };
        });
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          (user.first_name && user.first_name.toLowerCase().includes(query)) ||
          (user.last_name && user.last_name.toLowerCase().includes(query)) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Handle inviting a new user
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setNotification({
        type: "error",
        message: "Please enter an email address",
      });
      return;
    }

    setIsInviting(true);
    try {
      const result = await profileApi.inviteUser(inviteEmail, inviteRole);
      
      if (result.success) {
        setNotification({
          type: "success",
          message: result.message,
        });
        setInviteDialogOpen(false);
        
        // Add the invited user to the list
        const newUser: User = {
          id: `temp_${Date.now()}`,
          first_name: null,
          last_name: null,
          email: inviteEmail,
          role: inviteRole,
          status: "invited",
          tenant_id: users[0]?.tenant_id || "", // Use the same tenant as other users
          created_at: new Date().toISOString(),
        };
        
        setUsers([...users, newUser]);
        
        // Reset form
        setInviteEmail("");
        setInviteRole("viewer");
      } else {
        setNotification({
          type: "error",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      setNotification({
        type: "error",
        message: "Failed to send invitation. Please try again.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  // Calculate display name for a user
  const getUserDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.status === "invited") {
      return "Invited User";
    } else {
      return user.email.split("@")[0];
    }
  };

  // Get avatar fallback initials
  const getAvatarFallback = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    } else if (user.first_name) {
      return user.first_name[0];
    } else {
      return user.email[0].toUpperCase();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not the owner, show restricted message
  if (!isOwner) {
    return <NotOwnerMessage />;
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Alert
          variant={notification.type === "error" ? "destructive" : "default"}
          className={notification.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
        >
          <AlertDescription className="flex justify-between items-center">
            {notification.message}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotification(null)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization. They will receive an email with instructions to set up their account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(value) => setInviteRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <ShieldAlert className="h-4 w-4 mr-2" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="staff">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          <span>Staff</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>Viewer</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  {inviteRole === "admin" && "Admins have full access to all features and settings."}
                  {inviteRole === "staff" && "Staff can manage most content but have limited access to settings."}
                  {inviteRole === "viewer" && "Viewers can only view content but cannot make changes."}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" /> Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="p-6 flex flex-col items-center justify-center h-48">
          <UserX className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? "Try a different search term"
              : "Invite team members to get started"}
          </p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={getUserDisplayName(user)}
                        />
                        <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserDisplayName(user)}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={roleColors[user.role] || "bg-gray-100 text-gray-800"}
                    >
                      <span className="flex items-center">
                        <RoleIcon role={user.role} />
                        {user.role}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[user.status || "active"] || "bg-gray-100 text-gray-800"}
                    >
                      {user.status === "invited" ? (
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          invited
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          active
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={user.status === "invited"}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={user.status === "invited"}>
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          {user.status === "invited" ? "Revoke Invitation" : "Remove"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
