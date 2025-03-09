import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const QuotesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Quotes Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the Quotes Management page. Here you will
            be able to create, manage, and track quotes for your customers,
            convert quotes to invoices, and monitor their status.
          </p>
          <div className="mt-6 p-8 border rounded-md bg-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Quote listing will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotesPage;
