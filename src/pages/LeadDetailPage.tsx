
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeadDetail } from "@/components/LeadDetail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLead, getStageDisplayName } from "@/services/leadService";
import { Lead } from "@/models/Lead";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit } from "lucide-react";
import { LeadTransfer } from "@/components/LeadTransfer";

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      try {
        const leadData = await getLead(parseInt(id));
        if (leadData) {
          setLead(leadData);
        } else {
          toast({
            title: "Lead not found",
            description: "The requested lead could not be found.",
            variant: "destructive"
          });
          navigate("/leads");
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast({
          title: "Error",
          description: "There was a problem loading the lead details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id, navigate, toast]);

  const handleTransferComplete = () => {
    // Refresh lead data
    if (id) {
      getLead(parseInt(id)).then(leadData => {
        if (leadData) setLead(leadData);
      });
    }
  };

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/leads")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
        
        <div className="flex">
          {lead && (
            <>
              <LeadTransfer 
                selectedLeads={[lead.id]} 
                onTransferComplete={handleTransferComplete} 
              />
              <Button
                size="sm"
                onClick={() => navigate(`/leads/${id}/edit`)}
                className="ml-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Lead
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      ) : lead ? (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <CardTitle className="text-2xl font-bold">{lead.name}</CardTitle>
                <Badge className="mt-2 sm:mt-0 w-fit">
                  {getStageDisplayName(lead.currentStage)}
                </Badge>
              </div>
              <div className="text-muted-foreground flex flex-col gap-1 mt-2">
                <div className="text-sm">Company: {lead.company}</div>
                <div className="text-sm">Created by: User {lead.createdBy}</div>
                <div className="text-sm">Assigned to: User {lead.assignedTo}</div>
              </div>
            </CardHeader>
          </Card>
          
          <LeadDetail />
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p>Lead not found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadDetailPage;
