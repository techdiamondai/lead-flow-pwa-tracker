
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeadForm } from "@/components/LeadForm";
import { Lead } from "@/models/Lead";
import { getLead } from "@/services/leadService";
import { useToast } from "@/hooks/use-toast";

const EditLeadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      try {
        const leadId = parseInt(id, 10);
        const leadData = await getLead(leadId);
        
        if (leadData) {
          setLead(leadData);
        } else {
          toast({
            title: "Lead not found",
            description: "The requested lead could not be found.",
            variant: "destructive"
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast({
          title: "Error",
          description: "Could not load lead details for editing.",
          variant: "destructive"
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLead();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container px-4 py-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Lead</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Lead</h1>
      {lead && <LeadForm lead={lead} isEditing />}
    </div>
  );
};

export default EditLeadPage;
