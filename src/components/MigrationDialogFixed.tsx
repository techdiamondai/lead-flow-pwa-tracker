
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
      const success = await migrationService.migrateLeadsToSupabase(user.id);
      
      if (success) {
        toast({
          title: "Migration successful",
          description: "Your data has been migrated to the cloud."
        });
        onMigrationComplete();
      } else {
        toast({
          title: "Migration failed",
          description: "There was an error migrating your data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast({
        title: "Migration error",
        description: "An unexpected error occurred during migration.",
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
          <DialogTitle>Migrate Local Data</DialogTitle>
          <DialogDescription>
            This will migrate your local lead data to your cloud account. 
            Any existing data with the same IDs will be overwritten.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This operation cannot be undone. Are you sure you want to proceed?
          </p>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isMigrating}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleMigration}
            disabled={isMigrating}
          >
            {isMigrating ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-b-transparent"></span>
                Migrating...
              </>
            ) : (
              "Migrate Data"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
