import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Lead } from "@/models/Lead";
import { getLead, getStageDisplayName, deleteLead } from "@/services/leadService";
import { getUserNameById } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, ClipboardList, Calendar, User, UserCheck } from "lucide-react";
import { LeadHistoryEntry } from "./LeadHistoryEntry";

export const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignedToName, setAssignedToName] = useState<string>("");
  const [createdByName, setCreatedByName] = useState<string>("");
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      try {
        const leadData = await getLead(id);
        
        if (leadData) {
          setLead(leadData);
          
          // Fetch user names outside of the JSX rendering
          if (leadData.assigned_to) {
            getUserNameById(leadData.assigned_to).then(setAssignedToName);
          }
          if (leadData.created_by) {
            getUserNameById(leadData.created_by).then(setCreatedByName);
          }
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
          description: "Could not load lead details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLead();
  }, [id, navigate, toast]);
  
  const handleEdit = () => {
    navigate(`/leads/${id}/edit`);
  };
  
  const handleDelete = async () => {
    if (!id || !lead) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteLead(id);
      
      if (success) {
        toast({
          title: "Lead deleted",
          description: "The lead has been successfully deleted."
        });
        navigate("/dashboard");
      } else {
        throw new Error("Failed to delete lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Could not delete the lead. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
        <AlertDescription>
          Lead not found or you do not have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div className="w-full space-y-4 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <p className="text-muted-foreground">{lead.company}</p>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {isAdmin() && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-blue-500" />
                Lead Information
              </span>
              <Badge>{getStageDisplayName(lead.current_stage)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-1.5" />
                Contact Details
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                    {lead.email}
                  </a>
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                    {lead.phone}
                  </a>
                </p>
                {lead.position && (
                  <p>
                    <span className="font-medium">Position:</span> {lead.position}
                  </p>
                )}
                {lead.address && (
                  <p>
                    <span className="font-medium">Address:</span> {lead.address}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                Lead Status
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Created:</span> {formatDate(lead.created_at)}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span> {formatDate(lead.updated_at)}
                </p>
                <p>
                  <span className="font-medium">Created by:</span> {createdByName}
                </p>
                <p>
                  <span className="font-medium">Assigned to:</span> {assignedToName}
                </p>
                
                {isAdmin() && (
                  <div className="mt-4 pt-2 border-t">
                    <h4 className="text-xs font-semibold text-muted-foreground flex items-center mb-1">
                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                      Admin Information
                    </h4>
                    <p className="text-xs">
                      <span className="font-medium">Lead ID:</span> {lead.id}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Created by ID:</span> {lead.created_by}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Assigned to ID:</span> {lead.assigned_to}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {lead.notes && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">{lead.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead History</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.history && lead.history.length > 0 ? (
              <div className="space-y-4">
                {lead.history.map((entry, index) => (
                  <LeadHistoryEntry 
                    key={entry.id} 
                    entry={entry} 
                    formatDate={formatDate} 
                    isFirst={index === 0} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No history entries found.</p>
            )}
          </CardContent>
          
          {isAdmin() && (
            <CardFooter className="bg-blue-50/50 border-t">
              <p className="text-xs text-blue-600">
                As an admin, you have full access to all lead details and history.
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
