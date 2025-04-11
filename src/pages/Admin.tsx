
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Users, FileText, Settings, ChevronRight, Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";
import AddAdminForm from "@/components/AddAdminForm";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
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
          
          // Get 5 most recent leads
          const sortedLeads = [...leads].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          ).slice(0, 5);
          
          setRecentLeads(sortedLeads);
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
        
        // Get 5 most recent users
        const sortedUsers = [...parsedUsers].sort((a, b) => {
          const dateA = a.dateJoined ? new Date(a.dateJoined).getTime() : 0;
          const dateB = b.dateJoined ? new Date(b.dateJoined).getTime() : 0;
          return dateB - dateA;
        }).slice(0, 5);
        
        setRecentUsers(sortedUsers);
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
      case "won": return "success";
      case "lost": return "destructive";
      case "negotiation": return "warning";
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application settings, users and leads</p>
        </div>
        
        {/* Stats Overview Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : userStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userStats.adminUsers} admins, {userStats.regularUsers} regular users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : leadStats.totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.activeLeads} active leads
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{isLoading ? "..." : leadStats.wonLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.totalLeads > 0 ? Math.round((leadStats.wonLeads / leadStats.totalLeads) * 100) : 0}% conversion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lost Leads</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{isLoading ? "..." : leadStats.lostLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {leadStats.totalLeads > 0 ? Math.round((leadStats.lostLeads / leadStats.totalLeads) * 100) : 0}% lost rate
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access Section */}
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
              
              {!isLoading && recentUsers.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Recent Users</h4>
                  <div className="space-y-2">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/admin/users">
                  Manage Users
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Monitor and manage sales leads</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View comprehensive reports on leads, conversions, and sales activities.
              </p>
              
              {!isLoading && recentLeads.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Recent Leads</h4>
                  <div className="space-y-2">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="text-sm font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </div>
                        <Badge variant={getStageBadgeVariant(lead.current_stage)}>
                          {lead.current_stage}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/leads">
                  View All Leads
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
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
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">System Information</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Database Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Backup</span>
                    <span className="text-sm">N/A</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">System Version</span>
                    <span className="text-sm">1.0.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/settings">
                  Configure Settings
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Add Admin Form */}
        <div className="max-w-md border p-6 rounded-lg bg-card">
          <h3 className="text-lg font-medium mb-4">Add New Administrator</h3>
          <AddAdminForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
