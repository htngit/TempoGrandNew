import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileDetails from "./ProfileDetails";
import PasswordChange from "./PasswordChange";

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">My Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <ProfileDetails />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <PasswordChange />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
