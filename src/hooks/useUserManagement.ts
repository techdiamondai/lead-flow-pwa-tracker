
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
import { mergeUniqueUsers, filterUsersByQuery, updateUserRole } from "@/utils/userManagementUtils";
import { createAdminUser } from "@/hooks/auth/utils/roleUtils";

export type { User } from "@/types/user.types";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
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
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to promote to admin.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPromoting(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      // Process each selected user
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        
        if (!user) {
          failCount++;
          console.error("User not found:", userId);
          continue;
        }
        
        if (user.role === 'admin') {
          // Skip users who are already admins
          console.log(`User ${user.name} is already an admin, skipping`);
          continue;
        }
        
        // Call the createAdminUser function from roleUtils
        const success = await createAdminUser(
          user.name,
          user.email,
          user.id
        );
        
        if (success) {
          successCount++;
          // Update the user's role in our local state
          setUsers(prevUsers => updateUserRole(prevUsers, userId, 'admin'));
        } else {
          failCount++;
          console.error(`Failed to promote user: ${user.name}`);
        }
      }
      
      // Update filtered users based on the updated users array
      setFilteredUsers(filterUsersByQuery(users, searchQuery));
      
      // Show appropriate toast notification
      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Promoted ${successCount} user(s) to admin.`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to promote ${failCount} user(s).`,
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error("Error promoting users:", error);
      toast({
        title: "Error",
        description: "An error occurred while promoting users.",
        variant: "destructive"
      });
    } finally {
      setIsPromoting(false);
      setSelectedUsers([]);
      
      // Reload users to ensure we have the latest data
      loadUsers();
    }
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isLoading,
    isPromoting,
    error,
    handleSelectUser,
    handleSelectAll,
    promoteSelectedToAdmin,
    refetchUsers: loadUsers
  };
};
