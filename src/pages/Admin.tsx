
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Users, FileText, Settings, ChevronRight, CheckCircle, Clock, AlertCircle, BarChart3, Layout, UserPlus } from "lucide-react";
import AddAdminForm from "@/components/AddAdminForm";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AdminLeadManagement } from "@/components/AdminLeadManagement";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Admin = () => {
  const [leadStats, setLeadStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    wonLeads: 0,
    lostLeads: 0
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch lead statistics
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('*');
          
        if (leadsError) {
          console.error("Error fetching leads:", leadsError);
        } else {
          const activeLeads = leads.filter(lead => !["won", "lost"].includes(lead.current_stage));
          const wonLeads = leads.filter(lead => lead.current_stage === "won");
          const lostLeads = leads.filter(lead => lead.current_stage === "lost");
          
          setLeadStats({
            totalLeads: leads.length,
            activeLeads: activeLeads.length,
            wonLeads: wonLeads.length,
            lostLeads: lostLeads.length
          });
        }
        
        // Fetch user statistics
        // First get regular users from localStorage (this is temporary until all users are in Supabase)
        const storedUsers = localStorage.getItem("registered_users");
        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Then get admin users from Supabase
        const { data: adminUsers, error: adminError } = await supabase
          .from('admin_users')
          .select('*');
          
        if (adminError) {
          console.error("Error fetching admin users:", adminError);
        }
        
        setUserStats({
          totalUsers: parsedUsers.length,
          adminUsers: adminUsers ? adminUsers.length : 0,
          regularUsers: parsedUsers.length - (adminUsers ? adminUsers.length : 0)
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStageBadgeVariant = (stage) => {
    switch (stage) {
      case "won": return "default"; // Changed from "success" to "default"
      case "lost": return "destructive";
      case "negotiation": return "secondary"; // Changed from "warning" to "secondary"
      default: return "default";
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your application settings, users and leads
          </p>
        </div>
        
        {/* Stats Overview Section with improved design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : userStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userStats.adminUsers} admins, {userStats.regularUsers} regular users
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-t-4 border-t-indigo-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : leadStats.totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.activeLeads} active leads
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-t-4 border-t-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{isLoading ? "..." : leadStats.wonLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.totalLeads > 0 ? Math.round((leadStats.wonLeads / leadStats.totalLeads) * 100) : 0}% conversion rate
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-t-4 border-t-red-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lost Leads</CardTitle>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{isLoading ? "..." : leadStats.lostLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.totalLeads > 0 ? Math.round((leadStats.lostLeads / leadStats.totalLeads) * 100) : 0}% lost rate
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Management Tabs Section */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger value="users" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                <FileText className="mr-2 h-4 w-4" />
                Lead Management
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="users" className="space-y-6">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-6">
            <AdminLeadManagement />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
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
          </TabsContent>
        </Tabs>
        
        {/* Add Admin Form */}
        <div id="admin-form-section" className="border rounded-lg bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Add New Administrator</CardTitle>
            </div>
            <CardDescription>
              Create a new admin user with full system access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddAdminForm />
          </CardContent>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
