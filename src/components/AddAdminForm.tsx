
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminUser } from "@/hooks/auth/utils/roleUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";
import { UserProfile } from "@/hooks/auth/types";

const AddAdminForm = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, role');
        
        if (error) {
          throw error;
        }
        
        // Filter out users who are already admins
        const { data: admins } = await supabase.from('admin_users').select('id');
        const adminIds = admins ? admins.map(admin => admin.id) : [];
        
        const filteredUsers = data ? data.filter(user => !adminIds.includes(user.id)) : [];
        
        setUsers(filteredUsers as UserProfile[]);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast({
        title: "Selection Required",
        description: "Please select a user to promote to admin.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const selectedUser = users.find(user => user.id === selectedUserId);
      
      if (!selectedUser) {
        throw new Error("Selected user not found");
      }
      
      const success = await createAdminUser(
        selectedUser.name,
        selectedUser.email,
        selectedUser.id
      );
      
      if (success) {
        toast({
          title: "Success",
          description: `${selectedUser.name} has been promoted to admin.`
        });
        setSelectedUserId("");
        
        // Remove the added user from the list
        setUsers(users.filter(user => user.id !== selectedUserId));
      } else {
        throw new Error("Failed to create admin user");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error",
        description: "Failed to create admin user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Add New Admin</h3>
        <p className="text-sm text-muted-foreground">
          Promote an existing user to admin status
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user-select">Select User</Label>
        <Select
          value={selectedUserId}
          onValueChange={setSelectedUserId}
        >
          <SelectTrigger id="user-select" className="w-full">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.length === 0 && (
              <SelectItem value="no-users" disabled>
                No eligible users found
              </SelectItem>
            )}
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={loading || !selectedUserId}>
        {loading ? "Adding..." : "Add as Admin"}
      </Button>
    </form>
  );
};

export default AddAdminForm;
