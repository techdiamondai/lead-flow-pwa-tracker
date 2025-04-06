
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead, LeadStage } from "@/models/Lead";
import { getLeads, getStageDisplayName } from "@/services/leadService";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardStats: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const allLeads = await getLeads();
        
        // Filter leads based on user role
        let userLeads = allLeads;
        if (!isAdmin() && user) {
          userLeads = allLeads.filter(lead => lead.assigned_to === user.id);
        }
        
        setLeads(userLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [user, isAdmin]);
  
  // Count leads by stage
  const stageCounts: Record<LeadStage, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  };
  
  leads.forEach(lead => {
    stageCounts[lead.current_stage] = (stageCounts[lead.current_stage] || 0) + 1;
  });
  
  const totalLeads = leads.length;
  const activeLeads = leads.filter(lead => 
    !["won", "lost"].includes(lead.current_stage)
  ).length;
  
  const wonLeads = stageCounts.won || 0;
  const lostLeads = stageCounts.lost || 0;
  
  // Calculate conversion rate
  const closedLeads = wonLeads + lostLeads;
  const conversionRate = closedLeads > 0 
    ? Math.round((wonLeads / closedLeads) * 100) 
    : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
          ) : (
            <div className="text-2xl font-bold">{activeLeads}</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
  );
};
