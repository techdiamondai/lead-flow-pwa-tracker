
import { useEffect, useRef, useCallback } from "react";
import { useUserManagementStore } from "./userManagementStore";
import { useUsersLoader } from "./useUsersLoader";
import { createUserSelectionHandlers } from "./userSelectionHandlers";
import { useUserPromotion } from "./useUserPromotion";
import { UserManagementHook } from "./types";
import { filterUsersByQuery } from "@/utils/userManagementUtils";
import { debounce } from "@/utils/debounce";

export type { User } from "@/types/user.types";
export type { UserManagementHook } from "./types";

/**
 * Main hook for user management functionality
 */
export const useUserManagement = (): UserManagementHook => {
  const [
    state,
    { 
      setUsers, 
      setFilteredUsers, 
      setSearchQuery, 
      setSelectedUsers, 
      setIsLoading, 
      setError, 
      setIsPromoting,
      updateUserRole 
    }
  ] = useUserManagementStore();
  
  const { 
    users, 
    filteredUsers, 
    searchQuery, 
    selectedUsers, 
    isLoading, 
    error, 
    isPromoting 
  } = state;
  
  // Track initialization status
  const isInitializedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  
  // Load users
  const { loadUsers } = useUsersLoader(setUsers, setFilteredUsers, setIsLoading, setError);
  
  // Create selection handlers
  const { handleSelectUser, handleSelectAll } = createUserSelectionHandlers(
    filteredUsers,
    selectedUsers,
    setSelectedUsers
  );
  
  // Create promotion handler
  const { promoteSelectedToAdmin } = useUserPromotion(
    users,
    selectedUsers,
    setIsPromoting,
    updateUserRole,
    setSelectedUsers,
    loadUsers
  );
  
  // Debounced filter function to prevent too many re-renders
  const debouncedFilterUsers = useCallback(
    debounce((query: string, allUsers: typeof users) => {
      if (!isMountedRef.current) return;
      
      if (!query.trim()) {
        setFilteredUsers(allUsers);
        return;
      }
      
      const filtered = filterUsersByQuery(allUsers, query);
      setFilteredUsers(filtered);
    }, 300),
    [setFilteredUsers]
  );
  
  // Apply search filter when users or query changes
  useEffect(() => {
    if (!isMountedRef.current || users.length === 0) return;
    
    debouncedFilterUsers(searchQuery, users);
    
    return () => {
      debouncedFilterUsers.cancel();
    };
  }, [users, searchQuery, debouncedFilterUsers]);
  
  // Load users only once on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Only load once
    if (!isInitializedRef.current) {
      console.log("Initial user load triggered");
      isInitializedRef.current = true;
      loadUsers();
    }
    
    // Cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, [loadUsers]);
  
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
