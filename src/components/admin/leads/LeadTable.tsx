
import React from "react";
import { Lead } from "@/models/Lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Eye, ExternalLink } from "lucide-react";
import { getStageDisplayName } from "@/services/leadService";

interface LeadTableProps {
  filteredLeads: Lead[];
  selectedLeads: string[];
  handleSelectLead: (leadId: string) => void;
  handleSelectAll: () => void;
  getStageBadgeVariant: (stage: string) => "default" | "destructive" | "secondary" | "outline";
  formatDate: (dateString: string) => string;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  filteredLeads,
  selectedLeads,
  handleSelectLead,
  handleSelectAll,
  getStageBadgeVariant,
  formatDate
}) => {
  const navigate = useNavigate();
  
  return (
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
  );
};
