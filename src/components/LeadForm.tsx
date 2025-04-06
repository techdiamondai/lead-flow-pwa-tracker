
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead, NewLead, LeadStage } from "@/models/Lead";
import { createLead, updateLead, getAllStages } from "@/services/leadService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LeadFormProps {
  lead?: Lead;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  lead,
  isEditing = false,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const stages = getAllStages();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<NewLead>>({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    position: lead?.position || "",
    address: lead?.address || "",
    currentStage: lead?.currentStage || "new",
    assignedTo: lead?.assignedTo || (user?.id || ""),
    notes: lead?.notes || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleStageChange = (value: LeadStage) => {
    setFormData({
      ...formData,
      currentStage: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && lead) {
        // Update existing lead
        const success = await updateLead(
          lead.id, 
          formData, 
          user.id,
          formData.notes !== lead.notes ? `Notes updated: ${formData.notes}` : undefined
        );
        
        if (success) {
          toast({
            title: "Lead updated",
            description: "The lead has been successfully updated.",
          });
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/leads/${lead.id}`);
          }
        }
      } else {
        // Create new lead
        const newLeadId = await createLead(formData as NewLead, user.id);
        
        if (newLeadId) {
          toast({
            title: "Lead created",
            description: "The new lead has been successfully created.",
          });
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/leads/${newLeadId}`);
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the lead. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Lead" : "Create New Lead"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Job title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentStage">Stage</Label>
              <Select
                value={formData.currentStage}
                onValueChange={(value) => handleStageChange(value as LeadStage)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Business address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Lead" : "Create Lead"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
