import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  status: "active" | "inactive" | "pending";
}

const integrations: Integration[] = [
  {
    id: "1",
    name: "Google Calendar",
    description: "Sync your meetings and events",
    icon: "https://api.dicebear.com/7.x/icons/svg?icon=google",
    connected: true,
    status: "active",
  },
  {
    id: "2",
    name: "Slack",
    description: "Get notifications in your Slack channels",
    icon: "https://api.dicebear.com/7.x/icons/svg?icon=slack",
    connected: true,
    status: "active",
  },
  {
    id: "3",
    name: "Salesforce",
    description: "Sync contacts and leads with Salesforce",
    icon: "https://api.dicebear.com/7.x/icons/svg?icon=salesforce",
    connected: false,
    status: "inactive",
  },
  {
    id: "4",
    name: "Zapier",
    description: "Connect with thousands of apps",
    icon: "https://api.dicebear.com/7.x/icons/svg?icon=zap",
    connected: false,
    status: "inactive",
  },
];

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Integrations</h2>
      <p className="text-muted-foreground">
        Connect your CRM with other tools and services
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="h-10 w-10"
                />
                <div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <Switch checked={integration.connected} />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={`${integration.status === "active" ? "text-green-600" : "text-gray-500"}`}
                >
                  {integration.status === "active"
                    ? "Connected"
                    : "Not Connected"}
                </Badge>
                <Button variant="outline" size="sm">
                  {integration.connected ? "Configure" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for direct integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Generate New API Key</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
