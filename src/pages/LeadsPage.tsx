
import React from "react";
import { LeadList } from "@/components/LeadList";
import { SupabaseConnectionStatus } from "@/components/SupabaseConnectionStatus";

const LeadsPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">
          View and manage all your leads
        </p>
      </div>
      
      <SupabaseConnectionStatus />
      
      <LeadList />
    </div>
  );
};

export default LeadsPage;
