
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { migrationService } from "@/services/migrationService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface MigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMigrationComplete: () => void;
}

export const MigrationDialogFixed: React.FC<MigrationDialogProps> = ({
  open,
  onOpenChange,
  onMigrationComplete
}) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { user } = useAuth();
  
  const handleMigration = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to migrate your data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsMigrating(true);
    
    try {
      // We're fully on Supabase now, so this always succeeds
      const success = true;
      
      toast({
        title: "Already using cloud storage",
        description: "Your data is already stored in the cloud."
      });
      onMigrationComplete();
      
    } catch (error) {
      console.error("Migration error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cloud Storage</DialogTitle>
          <DialogDescription>
            Your data is already stored in the cloud and accessible from any device.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isMigrating}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
