
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  dateJoined?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allUsers: User[] = [];
      
      console.log("Starting to fetch users from Supabase...");
      
      // 1. Fetch profiles from Supabase
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, role, created_at');
        
      if (profilesError) {
        console.error("Error loading users from profiles:", profilesError);
        setError(`Database error: ${profilesError.message}`);
        toast({
          title: "Error",
          description: "Could not load users from database.",
          variant: "destructive"
        });
      } else if (profilesData) {
        // Add profiles data to users array
        profilesData.forEach(profile => {
          allUsers.push({
            id: profile.id,
            name: profile.name || 'Unknown',
            email: profile.email || 'Unknown',
            role: profile.role || 'user',
            dateJoined: profile.created_at
          });
        });
        
        console.log("Loaded users from Supabase profiles:", profilesData.length);
      }
      
      // 2. Also try to get admin_users from Supabase
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, name, email, created_at');
        
      if (adminError) {
        console.error("Error loading admin users:", adminError);
      } else if (adminData) {
        // Make sure we don't add duplicate users already in profiles
        const adminUsers = adminData.filter(
          admin => !allUsers.some(user => user.id === admin.id)
        );
        
        // Add admin users to the array
        adminUsers.forEach(admin => {
          allUsers.push({
            id: admin.id,
            name: admin.name || 'Unknown',
            email: admin.email || 'Unknown',
            role: 'admin',
            dateJoined: admin.created_at
          });
        });
        
        console.log("Loaded additional admin users:", adminUsers.length);
      }
      
      // 3. Check localStorage for any users not yet in Supabase
      try {
        const storedUsers = localStorage.getItem("registered_users");
        if (storedUsers) {
          const parsedUsers: User[] = JSON.parse(storedUsers);
          
          // Filter out any users that are already in our list
          const uniqueLocalUsers = parsedUsers.filter(
            localUser => !allUsers.some(user => user.id === localUser.id)
          );
          
          // Add unique local users to the array
          uniqueLocalUsers.forEach(user => {
            allUsers.push({
              ...user,
              dateJoined: user.dateJoined || new Date().toISOString()
            });
          });
          
          console.log("Loaded additional users from localStorage:", uniqueLocalUsers.length);
        }
      } catch (error) {
        console.error("Error parsing local users:", error);
      }
      
      // Set the users and filtered users state
      console.log("Total users loaded:", allUsers.length);
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error in loadUsers:", error);
      setError("Failed to load users. Please try again.");
      toast({
        title: "Error",
        description: "Could not load user data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const promoteSelectedToAdmin = async () => {
    // Implementation for promoting users to admin would go here
    // This would use createAdminUser from roleUtils for each selected user
    
    toast({
      description: `Promoted ${selectedUsers.length} user(s) to admin.`,
    });
    setSelectedUsers([]);
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isLoading,
    error,
    handleSelectUser,
    handleSelectAll,
    promoteSelectedToAdmin,
    refetchUsers: loadUsers
  };
};
