
import { useCallback, useRef } from "react";
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
  const isLoadingRef = useRef<boolean>(false);

  const loadUsers = useCallback(async (highlightUserId?: string | null) => {
    // Prevent multiple simultaneous loading attempts
    if (isLoadingRef.current) {
      console.log("Already loading users, skipping duplicate request");
      return;
    }
    
    try {
      isLoadingRef.current = true;
      console.log("🔄 Starting to load users...");
      setIsLoading(true);
      setError(null);
      
      // 1. First try to get from localStorage for immediate display
      const localUsers = getLocalUsers();
      if (localUsers.length > 0) {
        console.log("Found local users, displaying immediately:", localUsers.length);
        setUsers(localUsers);
        setFilteredUsers(localUsers);
      }
      
      // 2. Then fetch from remote sources in parallel
      const [profileUsers, adminUsers] = await Promise.all([
        fetchUserProfiles().catch(err => {
          console.error("Error fetching profiles:", err);
          return [];
        }),
        fetchAdminUsers().catch(err => {
          console.error("Error fetching admin users:", err);
          return [];
        })
      ]);
      
      console.log("Data sources loaded:", {
        profileUsers: profileUsers.length,
        adminUsers: adminUsers.length,
        localUsers: localUsers.length
      });
      
      // 3. Merge all unique users
      let allUsers = mergeUniqueUsers([profileUsers, adminUsers, localUsers]);
      
      // 4. Sanitize user data
      allUsers = sanitizeUserData(allUsers);
      
      // 5. Add a test user if no users found
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
      
      // 6. Update state with loaded users - do this as the last operation
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      
      // 7. Notify success if users loaded
      toast({
        description: `Successfully loaded ${allUsers.length} user(s).`,
      });
      
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
      
      // Reset loading status with a slight delay to prevent race conditions
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 500);
    }
  }, [setUsers, setFilteredUsers, setIsLoading, setError, toast]);

  return { loadUsers };
};
