import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Palette } from "lucide-react";
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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="tenant" className="w-full">
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={onThemeToggle}
                  />
                  <Moon className="h-5 w-5 text-muted-foreground" />
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
