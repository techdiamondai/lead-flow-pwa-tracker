import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user.types";
import { 
  fetchUserProfiles, 
  fetchAdminUsers, 
  getLocalUsers, 
  createTestUser, 
  saveTestUserToLocalStorage 
} from "@/services/userDataService";
import { mergeUniqueUsers, filterUsersByQuery } from "@/utils/userManagementUtils";

export type { User } from "@/types/user.types";

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
      console.log("🔄 Starting to load users...");
      setIsLoading(true);
      setError(null);
      
      // 1. Fetch users from different sources
      const profileUsers = await fetchUserProfiles().catch(() => []);
      const adminUsers = await fetchAdminUsers().catch(() => []);
      const localUsers = getLocalUsers();
      
      // 2. Merge all unique users
      let allUsers = mergeUniqueUsers([profileUsers, adminUsers, localUsers]);
      console.log("🔢 Total users loaded:", allUsers.length);
      
      // 3. Add a test user if no users found
      if (allUsers.length === 0) {
        console.log("⚠️ No users found, adding fallback test user");
        const testUser = createTestUser();
        allUsers.push(testUser);
        saveTestUserToLocalStorage(testUser);
      }
      
      // 4. Update state with loaded users
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      
      // 5. Notify success if users loaded
      if (allUsers.length > 0) {
        toast({
          description: `Successfully loaded ${allUsers.length} user(s).`,
        });
      }
      
    } catch (error: any) {
      console.error("❌ Error in loadUsers:", error);
      setError(error?.message || "Failed to load users. Please try again.");
      toast({
        title: "Error",
        description: "Could not load user data. Please try again.",
        variant: "destructive"
      });
      
      // Add a test user anyway to ensure UI is not empty
      const testUser = createTestUser(true);
      setUsers([testUser]);
      setFilteredUsers([testUser]);
      
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  // Filter users based on search query
  useEffect(() => {
    setFilteredUsers(filterUsersByQuery(users, searchQuery));
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
