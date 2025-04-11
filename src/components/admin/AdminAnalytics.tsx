
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const AdminAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Comprehensive analytics for the CRM platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px] border rounded-md">
          <p className="text-muted-foreground">Analytics visualization will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
};
