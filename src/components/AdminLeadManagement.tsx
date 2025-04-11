
import React, { useState, useEffect } from "react";
import { Lead } from "@/models/Lead";
import { getLeads, getStageDisplayName } from "@/services/leadService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LeadBulkActions } from "@/components/LeadBulkActions";
import { Eye, Search, ExternalLink, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const AdminLeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const allLeads = await getLeads();
      // Sort by most recent update
      allLeads.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setLeads(allLeads);
      setFilteredLeads(allLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeads();
  }, []);
  
  useEffect(() => {
    // Filter leads based on search query
    if (searchQuery.trim() === "") {
      setFilteredLeads(leads);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = leads.filter(
        lead =>
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          (lead.email && lead.email.toLowerCase().includes(query)) ||
          (lead.phone && lead.phone.toLowerCase().includes(query))
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);
  
  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };
  
  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "won": return "default";
      case "lost": return "destructive";
      case "negotiation": return "secondary";
      default: return "outline";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
  
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
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads by name, company, email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <LeadBulkActions 
            selectedLeads={selectedLeads}
            onActionComplete={() => {
              fetchLeads();
              setSelectedLeads([]);
            }}
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leads found</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <Checkbox 
                      checked={selectedLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-left font-medium">Stage</th>
                  <th className="px-4 py-3 text-left font-medium">Assigned To</th>
                  <th className="px-4 py-3 text-left font-medium">Updated</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-muted/50 ${
                      selectedLeads.includes(lead.id) ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                        aria-label={`Select ${lead.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {lead.name}
                      <div className="text-xs text-muted-foreground">
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">{lead.company}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStageBadgeVariant(lead.current_stage)}>
                        {getStageDisplayName(lead.current_stage)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {lead.assigned_to || "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(lead.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <Link to={`/leads/${lead.id}/edit`}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Edit lead</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
