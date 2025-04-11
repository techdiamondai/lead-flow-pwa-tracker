
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserPlus } from "lucide-react";
import AddAdminForm from "@/components/AddAdminForm";
import { supabase } from "@/integrations/supabase/client";
import { AdminLeadManagement } from "@/components/AdminLeadManagement";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminStatsOverview } from "@/components/admin/AdminStatsOverview";
import { AdminSystemSettings } from "@/components/admin/AdminSystemSettings";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

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
        
        {/* Stats Overview Section */}
        <AdminStatsOverview 
          userStats={userStats} 
          leadStats={leadStats} 
          isLoading={isLoading} 
        />
        
        {/* Management Tabs Section */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger value="users" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                Users
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                Leads
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
                Settings
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none border-b-2 border-transparent px-4 h-12">
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
            <AdminSystemSettings />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <AdminAnalytics />
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
