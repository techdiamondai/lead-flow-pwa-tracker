
import React, { useState, useEffect } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { LeadList } from "@/components/LeadList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { MigrationDialog } from "@/components/MigrationDialog";
import { migrationService } from "@/services/migrationService";
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await migrationService.checkSupabaseConnection();
      setSupabaseConnected(connected);
    };
    
    checkConnection();
  }, []);

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your leads and activities
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          {supabaseConnected !== null && (
            <Badge variant={supabaseConnected ? "default" : "destructive"}>
              {supabaseConnected ? "Supabase Connected" : "Supabase Offline"}
            </Badge>
          )}
        </div>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Your most recently updated leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadList />
          </CardContent>
        </Card>
      </div>
      
      {/* Migration dialog for transferring local data to Supabase */}
      <MigrationDialog />
    </div>
  );
};

export default Dashboard;
