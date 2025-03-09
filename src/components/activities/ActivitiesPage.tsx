import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const ActivitiesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activities</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Activities Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the Activities Management page. Here you
            will be able to schedule, track, and manage all customer-related
            activities including calls, meetings, tasks, and follow-ups.
          </p>
          <div className="mt-6 p-8 border rounded-md bg-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Activity calendar and listing will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
