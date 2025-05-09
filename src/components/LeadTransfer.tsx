
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transferLeads } from "@/services/leadService";
import { useAuth } from "@/hooks/auth";
import { useToast } from "@/hooks/use-toast";
import { UsersIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LeadTransferProps {
  selectedLeads: string[];
  onTransferComplete?: () => void;
}

export const LeadTransfer: React.FC<LeadTransferProps> = ({ 
  selectedLeads,
  onTransferComplete
}) => {
  const { user: currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const adminStatus = await isAdmin();
          console.log("Admin status check in LeadTransfer:", adminStatus);
          setIsAdminUser(adminStatus);
        } catch (error) {
          console.error("Error checking admin status in LeadTransfer:", error);
          setIsAdminUser(false);
        }
      }
    };
    
    checkAdminStatus();
  }, [currentUser, isAdmin]);
  
  // Load real users from localStorage instead of mock data
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem("registered_users");
        if (storedUsers) {
          const allUsers: User[] = JSON.parse(storedUsers);
          // Filter out the current user
          const filteredUsers = allUsers.filter(u => u.id !== currentUser?.id);
          setAvailableUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Could not load available users.",
          variant: "destructive"
        });
      }
    };

    loadUsers();
  }, [currentUser, toast]);
  
  const handleTransfer = async () => {
    if (!selectedUserId || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await transferLeads(
        selectedLeads,
        selectedUserId,
        currentUser.id
      );
      
      if (success) {
        const selectedUser = availableUsers.find(u => u.id === selectedUserId);
        toast({
          title: "Leads transferred",
          description: `Successfully transferred ${selectedLeads.length} lead(s) to ${selectedUser?.name || 'another user'}`,
        });
        
        if (onTransferComplete) {
          onTransferComplete();
        }
      } else {
        toast({
          title: "Error transferring leads",
          description: "There was a problem transferring the leads. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      console.error("Error transferring leads:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Only admins can transfer leads and only show if leads are selected
  if (!isAdminUser || selectedLeads.length === 0 || availableUsers.length === 0) {
    return null;
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <UsersIcon className="h-4 w-4 mr-2" />
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Lead{selectedLeads.length > 1 ? 's' : ''}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Transfer {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} to another user
          </p>
          
          <div className="space-y-2">
            <label htmlFor="user" className="text-sm font-medium">
              Select User
            </label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleTransfer}
            disabled={!selectedUserId || isSubmitting}
          >
            {isSubmitting ? "Transferring..." : "Transfer Lead(s)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
