
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { LeadBulkActions } from "@/components/LeadBulkActions";
import { LeadSearchBar } from "./leads/LeadSearchBar";
import { LeadTable } from "./leads/LeadTable";
import { LeadLoadingState } from "./leads/LeadLoadingState";
import { LeadEmptyState } from "./leads/LeadEmptyState";
import { useLeadManagement } from "@/hooks/useLeadManagement";

export const AdminLeadManagement: React.FC = () => {
  const {
    filteredLeads,
    searchQuery,
    setSearchQuery,
    selectedLeads,
    setSelectedLeads,
    isLoading,
    fetchLeads,
    handleSelectLead,
    handleSelectAll,
    getStageBadgeVariant,
    formatDate
  } = useLeadManagement();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lead Management</CardTitle>
        <Button asChild>
          <Link to="/leads/new">
            Create New Lead
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between gap-4">
          <LeadSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <LeadBulkActions 
            selectedLeads={selectedLeads}
            onActionComplete={() => {
              fetchLeads();
              setSelectedLeads([]);
            }}
          />
        </div>

        {isLoading ? (
          <LeadLoadingState />
        ) : filteredLeads.length === 0 ? (
          <LeadEmptyState />
        ) : (
          <LeadTable
            filteredLeads={filteredLeads}
            selectedLeads={selectedLeads}
            handleSelectLead={handleSelectLead}
            handleSelectAll={handleSelectAll}
            getStageBadgeVariant={getStageBadgeVariant}
            formatDate={formatDate}
          />
        )}
      </CardContent>
    </Card>
  );
};
