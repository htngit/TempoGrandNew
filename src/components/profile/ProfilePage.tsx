import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileDetails from "./ProfileDetails";
import ContactInformation from "./ContactInformation";
import PasswordChange from "./PasswordChange";

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Personal Details</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <ProfileDetails />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <ContactInformation />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <PasswordChange />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
