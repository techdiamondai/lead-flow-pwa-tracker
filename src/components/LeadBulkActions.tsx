
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadTransfer } from "@/components/LeadTransfer";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteLead } from "@/services/leadService";
import { useToast } from "@/hooks/use-toast";

interface LeadBulkActionsProps {
  selectedLeads: string[];
  onActionComplete: () => void;
}

export const LeadBulkActions: React.FC<LeadBulkActionsProps> = ({ 
  selectedLeads, 
  onActionComplete 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete each selected lead
      for (const leadId of selectedLeads) {
        await deleteLead(leadId);
      }
      
      toast({
        title: "Leads deleted",
        description: `Successfully deleted ${selectedLeads.length} lead(s)`,
      });
      
      onActionComplete();
    } catch (error) {
      toast({
        title: "Error deleting leads",
        description: "There was a problem deleting the leads. Please try again.",
        variant: "destructive"
      });
      console.error("Error deleting leads:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {selectedLeads.length > 0 && (
        <>
          <LeadTransfer 
            selectedLeads={selectedLeads} 
            onTransferComplete={onActionComplete} 
          />
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selectedLeads.length} lead{selectedLeads.length !== 1 && 's'}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};
