import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction, AlertCircle } from "lucide-react";

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Integrations</h2>
      <p className="text-muted-foreground">
        Connect your CRM with other tools and services
      </p>

      <Alert variant="default" className="bg-yellow-50 border-yellow-200">
        <Construction className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800 font-medium">
          Under Development
        </AlertTitle>
        <AlertDescription className="text-yellow-700">
          The integrations feature is currently under development. We're working on connecting with popular services like Google Calendar, Slack, Salesforce, and more. Check back soon!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Planned integrations for future releases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-1">Google Calendar</div>
              <div className="text-sm text-muted-foreground">Sync your meetings and events</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-1">Slack</div>
              <div className="text-sm text-muted-foreground">Get notifications in your Slack channels</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-1">Salesforce</div>
              <div className="text-sm text-muted-foreground">Sync contacts and leads with Salesforce</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-1">Zapier</div>
              <div className="text-sm text-muted-foreground">Connect with thousands of apps</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
