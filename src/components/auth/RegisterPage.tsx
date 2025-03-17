import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { authApi, tenantApi, profileApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterPageProps {
  onRegister?: (name: string, email: string, password: string) => void;
}

const RegisterPage = ({ onRegister }: RegisterPageProps) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Register the user with Supabase
      const { user, error } = await authApi.signUp(email, password);

      if (error) {
        throw new Error(error.message || "Failed to create account");
      }

      if (!user) {
        throw new Error("No user returned from registration");
      }

      // Create a tenant for the new user
      if (user.id) {
        console.log("Creating tenant for user ID:", user.id);
        const tenant = await tenantApi.create({
          name: `${name}'s Organization`,
        });

        if (!tenant) {
          console.error("Failed to create tenant");
          throw new Error("Failed to create organization");
        }
        
        console.log("Created tenant:", tenant);
        
        // Set the user's profile with admin role (making them the tenant owner)
        const nameArr = name.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr.length > 1 ? nameArr.slice(1).join(' ') : '';
        
        const profile = await profileApi.update(user.id, {
          first_name: firstName,
          last_name: lastName,
          role: 'admin', // Set as admin - this makes them the owner
          tenant_id: tenant.id,
          onboarding_complete: false, // They'll need to complete onboarding
        });
        
        if (!profile) {
          console.error("Failed to update user profile");
        } else {
          console.log("Updated user profile with admin role:", profile);
        }
      }

      // Call the onRegister prop if provided
      if (onRegister) {
        onRegister(name, email, password);
      }

      setSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Account created successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading || success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading || success}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
