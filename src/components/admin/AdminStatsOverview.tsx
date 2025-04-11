
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface StatsProps {
  userStats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  };
  leadStats: {
    totalLeads: number;
    activeLeads: number;
    wonLeads: number;
    lostLeads: number;
  };
  isLoading: boolean;
}

export const AdminStatsOverview: React.FC<StatsProps> = ({ userStats, leadStats, isLoading }) => {
  return (
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
  );
};
