
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lead } from "@/models/Lead";
import { getLeads } from "@/services/leadService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch all leads for admin
  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const allLeads = await getLeads();
        setLeads(allLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin()) {
      fetchAllLeads();
    } else {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view the admin dashboard.",
        variant: "destructive"
      });
      navigate("/dashboard");
    }
  }, [isAdmin, navigate, toast]);
  
  // Calculate statistics for admin dashboard
  const totalLeads = leads.length;
  
  // Count leads by stage
  const stageCount: Record<string, number> = {};
  leads.forEach(lead => {
    stageCount[lead.currentStage] = (stageCount[lead.currentStage] || 0) + 1;
  });
  
  // Count leads by assignee
  const assigneeCount: Record<string, number> = {};
  leads.forEach(lead => {
    assigneeCount[lead.assignedTo] = (assigneeCount[lead.assignedTo] || 0) + 1;
  });
  
  const wonLeads = stageCount.won || 0;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your CRM system and view analytics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{totalLeads}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{wonLeads}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{conversionRate}%</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
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
            ) : (
              <div className="space-y-4">
                {Object.entries(stageCount).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between items-center">
                    <span className="capitalize">{stage}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Performance</CardTitle>
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
            ) : (
              <div className="space-y-4">
                {Object.entries(assigneeCount).map(([userId, count]) => (
                  <div key={userId} className="flex justify-between items-center">
                    <span>User ID: {userId}</span>
                    <span className="font-medium">{count} leads</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            Manage system settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Data Management</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Export All Leads
                </Button>
                <Button variant="outline" size="sm">
                  Import Leads
                </Button>
                <Button variant="outline" size="sm">
                  Backup System
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">System Settings</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  User Management
                </Button>
                <Button variant="outline" size="sm">
                  Configure Stages
                </Button>
                <Button variant="outline" size="sm">
                  Email Templates
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
