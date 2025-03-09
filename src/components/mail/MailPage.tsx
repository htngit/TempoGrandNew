import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const MailPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mail</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Mail System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the Mail System page. Here you will be
            able to send, receive, and manage emails directly within the CRM,
            track email communications with customers, and use email templates.
          </p>
          <div className="mt-6 p-8 border rounded-md bg-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Email inbox and composer will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MailPage;
