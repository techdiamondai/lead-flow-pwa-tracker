
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/models/Lead";
import { getLeads, getStageDisplayName } from "@/services/leadService";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Eye } from "lucide-react";

export const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const allLeads = await getLeads();
        
        // Filter leads based on user role
        let userLeads = allLeads;
        if (!isAdmin() && user) {
          userLeads = allLeads.filter(lead => lead.assigned_to === user.id);
        }
        
        // Sort by most recent update
        userLeads.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        setLeads(userLeads);
        setFilteredLeads(userLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [user, isAdmin]);

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
          lead.email.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query)
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "qualified":
        return "outline";
      case "proposal":
        return "secondary";
      case "negotiation":
        return "default";
      case "won":
        return "success";
      case "lost":
        return "destructive";
      default:
        return "default";
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isAdmin() ? "All Leads" : "My Leads"}
        </CardTitle>
        <Button 
          onClick={() => navigate("/leads/new")}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse h-6 w-28 bg-muted rounded mx-auto"></div>
            <div className="animate-pulse h-4 w-48 bg-muted rounded mx-auto mt-2"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery.trim() !== "" ? (
              <p>No leads match your search.</p>
            ) : (
              <p>No leads found. Create your first lead!</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg hover:bg-accent/10 cursor-pointer"
                onClick={() => navigate(`/leads/${lead.id}`)}
              >
                <div className="space-y-1">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lead.company}
                  </div>
                  {isAdmin() && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Assigned to: {lead.assigned_to || "Unassigned"}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center mt-2 sm:mt-0">
                  <Badge variant={getStageBadgeVariant(lead.current_stage) as any}>
                    {getStageDisplayName(lead.current_stage)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDate(lead.updated_at)}
                  </span>
                  {isAdmin() && (
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/leads/${lead.id}`);
                    }}>
                      <Eye className="h-3.5 w-3.5" />
                      <span className="sr-only">View details</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
