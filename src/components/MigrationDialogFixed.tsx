
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const { user } = useAuth();
  
  const handleClose = () => {
    toast({
      title: "Supabase Integration",
      description: "Your data is stored in Supabase cloud. To clear all data including login tokens, run clearAllStorage() in the browser console."
    });
    onMigrationComplete();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supabase Cloud Storage</DialogTitle>
          <DialogDescription>
            Your data is stored in Supabase cloud and accessible from any device. 
            Authentication tokens are stored in your browser's localStorage.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={handleClose}>
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
