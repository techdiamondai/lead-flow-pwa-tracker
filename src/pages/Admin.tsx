
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Users, FileText, Settings } from "lucide-react";
import AddAdminForm from "@/components/AddAdminForm";

const Admin = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application settings and users</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View, edit, and delete user accounts. Manage user roles and permissions.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/admin/users">Manage Users</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Lead Reports</CardTitle>
              <CardDescription>Access lead management reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View comprehensive reports on leads, conversions, and sales activities.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/admin/reports">View Reports</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Adjust system settings, integrations, and application behavior.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/admin/settings">Configure</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="max-w-md">
          <AddAdminForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
