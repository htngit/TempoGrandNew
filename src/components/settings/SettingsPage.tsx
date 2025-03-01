import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenantSettings from "./TenantSettings";
import UserManagement from "./UserManagement";
import IntegrationSettings from "./IntegrationSettings";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="tenant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenant">Tenant Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default SettingsPage;
