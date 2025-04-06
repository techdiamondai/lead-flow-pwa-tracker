
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { migrationService } from "@/services/migrationService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IndexedDB } from "@/services/db";
import { Lead } from "@/models/Lead";

export const MigrationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsMigration, setNeedsMigration] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if migration is needed when user is authenticated
    if (user) {
      const checkMigration = async () => {
        try {
          // Check if there are any leads in the local storage
          const db = new IndexedDB<Lead>("diamondflow", { storeName: "leads" });
          const localLeads = await db.getAll();
          const needs = localLeads && localLeads.length > 0;
          
          setNeedsMigration(needs);
          if (needs) {
            setOpen(true);
          }
        } catch (error) {
          console.error("Error checking for migration:", error);
        }
      };
      
      checkMigration();
    }
  }, [user]);
  
  const handleMigrate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to migrate your data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await migrationService.migrateLeadsToSupabase(user.id);
      
      if (success) {
        toast({
          title: "Migration successful",
          description: "Your leads have been migrated to your cloud account."
        });
        setOpen(false);
        setNeedsMigration(false);
      } else {
        toast({
          title: "Migration failed",
          description: "An error occurred while migrating your data. Please try again.",
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
      setIsLoading(false);
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Migration skipped",
      description: "You can migrate your local data later from the settings page."
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open && needsMigration} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data Migration Available</DialogTitle>
          <DialogDescription>
            We detected leads in your local storage. Would you like to migrate them to your cloud account?
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Migrating will move all your locally stored leads to your cloud account, allowing you to access them from any device.
          This process cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleMigrate} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
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
