
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchUserProfiles, 
  fetchAdminUsers, 
  getLocalUsers, 
  createTestUser, 
  saveTestUserToLocalStorage,
  saveUsersToLocalStorage
} from "@/services/userDataService";
import { 
  mergeUniqueUsers, 
  sanitizeUserData
} from "@/utils/userManagementUtils";
import { User } from "@/types/user.types";

/**
 * Hook for loading user data from different sources
 */
export const useUsersLoader = (
  setUsers: (users: User[]) => void,
  setFilteredUsers: (users: User[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    // Prevent multiple simultaneous loading attempts
    let isLoadingLocal = false;
    if (isLoadingLocal) return;
    
    try {
      isLoadingLocal = true;
      console.log("🔄 Starting to load users...");
      setIsLoading(true);
      setError(null);
      
      // 1. Fetch users from different sources
      const profilesPromise = fetchUserProfiles().catch(err => {
        console.error("Error fetching profiles:", err);
        return [];
      });
      
      const adminUsersPromise = fetchAdminUsers().catch(err => {
        console.error("Error fetching admin users:", err);
        return [];
      });
      
      // Fetch in parallel
      const [profileUsers, adminUsers] = await Promise.all([
        profilesPromise,
        adminUsersPromise
      ]);
      
      const localUsers = getLocalUsers();
      
      console.log("Data sources loaded:", {
        profileUsers: profileUsers.length,
        adminUsers: adminUsers.length,
        localUsers: localUsers.length
      });
      
      // 2. Merge all unique users
      let allUsers = mergeUniqueUsers([profileUsers, adminUsers, localUsers]);
      
      // 3. Sanitize user data
      allUsers = sanitizeUserData(allUsers);
      
      // 4. Add a test user if no users found
      if (allUsers.length === 0) {
        console.log("⚠️ No users found, adding fallback test user");
        const testUser = createTestUser();
        allUsers.push(testUser);
        saveTestUserToLocalStorage(testUser);
      } else {
        // Save all users to localStorage for persistence
        saveUsersToLocalStorage(allUsers);
      }
      
      console.log("🔢 Total users loaded:", allUsers.length);
      
      // 5. Update state with loaded users
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
      isLoadingLocal = false;
      setIsLoading(false);
    }
  }, [setUsers, setFilteredUsers, setIsLoading, setError, toast]);

  return { loadUsers };
};
