
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, FileText, Layout, ChevronRight } from "lucide-react";

export const AdminSystemSettings: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Adjust system settings and parameters</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Application Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2 font-medium">1.0.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="ml-2 font-medium">Production</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Database:</span>
                  <span className="ml-2 font-medium">Connected</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Backup:</span>
                  <span className="ml-2 font-medium">N/A</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View System Logs</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Access common admin functions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/admin/users">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/leads">
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Manage Leads
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/dashboard">
              <span className="flex items-center">
                <Layout className="mr-2 h-4 w-4" />
                Dashboard
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
