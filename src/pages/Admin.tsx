import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/models/Lead";
import { getLeads } from "@/services/leadService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Settings, 
  Database, 
  BarChart3, 
  FileCog, 
  Download, 
  Upload, 
  Save, 
  UserCog,
  RefreshCw
} from "lucide-react";

export function AdminUserName() {
  const { profile } = useAuth();
  return profile?.name || "Admin";
}

const AdminPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  
  // Function to refresh data manually
  const refreshData = async () => {
    setIsLoading(true);
    await fetchAllLeads();
    fetchRegisteredUsers();
    setLastRefreshed(new Date());
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated."
    });
    setIsLoading(false);
  };
  
  // Fetch registered users
  const fetchRegisteredUsers = () => {
    const storedUsers = localStorage.getItem("registered_users");
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  };
  
  useEffect(() => {
    fetchRegisteredUsers();
  }, []);
  
  const getUserNameById = (userId: string): string => {
    const foundUser = registeredUsers.find(u => u.id === userId);
    return foundUser ? foundUser.name : `User ID: ${userId}`;
  };
  
  // Function to fetch all leads
  const fetchAllLeads = async () => {
    try {
      const allLeads = await getLeads();
      setLeads(allLeads);
      return allLeads;
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    // Use our new isAdmin check
    const checkAdminStatus = async () => {
      try {
        const { isAdmin } = await import("@/hooks/auth/utils/roleUtils");
        const isAdminUser = await isAdmin(profile);
        
        if (!isAdminUser) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to view the admin dashboard.",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
        
        // If admin, proceed with data fetching
        fetchAllLeads();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/dashboard");
      }
    };
    
    checkAdminStatus();
    
    // Set up real-time subscription for leads table
    const leadsChannel = supabase
      .channel('public:leads')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('Leads change received:', payload);
          // Refresh all data when any change happens
          fetchAllLeads();
          setLastRefreshed(new Date());
      })
      .subscribe();
      
    // Set up real-time subscription for lead_history table
    const historyChannel = supabase
      .channel('public:lead_history')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'lead_history' }, 
        (payload) => {
          console.log('Lead history change received:', payload);
          fetchAllLeads();
          setLastRefreshed(new Date());
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(historyChannel);
    };
  }, [navigate, toast, profile]);
  
  const totalLeads = leads.length;
  
  const stageCount: Record<string, number> = {};
  leads.forEach(lead => {
    stageCount[lead.current_stage] = (stageCount[lead.current_stage] || 0) + 1;
  });
  
  const assigneeCount: Record<string, number> = {};
  leads.forEach(lead => {
    if (lead.assigned_to) {
      assigneeCount[lead.assigned_to] = (assigneeCount[lead.assigned_to] || 0) + 1;
    }
  });
  
  const wonLeads = stageCount.won || 0;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const registeredUsersCount = registeredUsers.length;
  
  // Format date for last refreshed timestamp
  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString();
  };
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Manage your CRM system and view analytics
            <span className="text-xs text-muted-foreground">
              Last updated: {formatLastRefreshed()}
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0" 
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 border-indigo-200">
            Admin
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border-green-200">
            {AdminUserName()}
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{totalLeads}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Won Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{wonLeads}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{conversionRate}%</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredUsersCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto mb-4 bg-muted/50">
          <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
          <TabsTrigger value="management" className="py-2">Management</TabsTrigger>
          <TabsTrigger value="settings" className="py-2">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Lead Status Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of leads by current stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse h-4 w-full bg-muted rounded"></div>
                    <div className="animate-pulse h-4 w-3/4 bg-muted rounded"></div>
                    <div className="animate-pulse h-4 w-2/3 bg-muted rounded"></div>
                    <div className="animate-pulse h-4 w-1/2 bg-muted rounded"></div>
                  </div>
                ) : Object.keys(stageCount).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No leads data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stageCount).map(([stage, count]) => (
                      <div key={stage} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="capitalize mr-2" variant={stage === "won" ? "default" : "outline"}>
                            {stage}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                stage === "won" ? "bg-green-500" : 
                                stage === "negotiation" ? "bg-amber-500" : 
                                stage === "proposal" ? "bg-blue-500" : 
                                "bg-gray-500"
                              }`}
                              style={{ width: `${totalLeads > 0 ? (count / totalLeads) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Performance
                </CardTitle>
                <CardDescription>
                  Leads assigned by user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse h-4 w-full bg-muted rounded"></div>
                    <div className="animate-pulse h-4 w-3/4 bg-muted rounded"></div>
                  </div>
                ) : Object.keys(assigneeCount).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No assigned leads data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(assigneeCount).map(([userId, count]) => (
                      <div key={userId} className="flex justify-between items-center">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal text-left" 
                          onClick={() => navigate(`/admin/users?highlight=${userId}`)}
                        >
                          {getUserNameById(userId)}
                        </Button>
                        <Badge variant="outline" className="ml-2">
                          {count} leads
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>
                Import, export, and back up your CRM data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <Download className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Export All Leads</div>
                    <div className="text-xs text-muted-foreground">Download as CSV or JSON</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <Upload className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Import Leads</div>
                    <div className="text-xs text-muted-foreground">Upload CSV or JSON file</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <Save className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Backup System</div>
                    <div className="text-xs text-muted-foreground">Create full system backup</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start h-auto py-3 px-4"
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">View and edit user accounts</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <FileCog className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Role Management</div>
                    <div className="text-xs text-muted-foreground">Configure user roles</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <FileCog className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Configure Stages</div>
                    <div className="text-xs text-muted-foreground">Customize lead stages</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <FileCog className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Email Templates</div>
                    <div className="text-xs text-muted-foreground">Manage email templates</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-start h-auto py-3 px-4">
                  <FileCog className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Notification Settings</div>
                    <div className="text-xs text-muted-foreground">Configure system notifications</div>
                  </div>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4 mt-4">
              <Button variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
