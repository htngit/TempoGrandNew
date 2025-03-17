import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Palette, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TenantSettings from "./TenantSettings";
import UserManagement from "./UserManagement";
import IntegrationSettings from "./IntegrationSettings";

interface SettingsPageProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const SettingsPage = ({
  isDarkMode = false,
  onThemeToggle = () => console.log("theme toggle clicked"),
}: SettingsPageProps) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(isDarkMode ? "dark" : "light");
  const [isThemeApplied, setIsThemeApplied] = useState(false);

  // Apply the theme to the whole document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      if (systemTheme === "dark") {
        onThemeToggle();
      }
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      if (theme === "dark" && !isDarkMode) {
        onThemeToggle();
      } else if (theme === "light" && isDarkMode) {
        onThemeToggle();
      }
    }

    if (isThemeApplied) {
      setTimeout(() => setIsThemeApplied(false), 3000);
    }
  }, [theme, isDarkMode, onThemeToggle, isThemeApplied]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsThemeApplied(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenant">Tenant Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="tenant" className="mt-6">
          <TenantSettings />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        <TabsContent value="integrations" className="mt-6">
          <IntegrationSettings />
        </TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isThemeApplied && (
                <div className="flex items-center gap-2 p-2 mb-4 rounded-md bg-green-50 text-green-700 border border-green-200">
                  <Check className="h-5 w-5" />
                  <span>Theme applied successfully!</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Theme Mode</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred theme mode
                  </p>
                  
                  <RadioGroup
                    value={theme}
                    onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="light"
                        id="theme-light"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-2 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="dark"
                        id="theme-dark"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-2 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="system"
                        id="theme-system"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <RotateCcw className="mb-2 h-6 w-6" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Quick Toggle</Label>
                    <div className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <Switch
                      id="dark-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => handleThemeChange(checked ? "dark" : "light")}
                    />
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => handleThemeChange("system")}
                  >
                    Reset to System Default
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
