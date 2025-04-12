
import { useEffect, useRef } from "react";
import { User } from "@/types/user.types";
import { useUserManagementStore } from "./userManagementStore";
import { useUsersLoader } from "./useUsersLoader";
import { useUserSearchFilter } from "./useUserSearchFilter";
import { createUserSelectionHandlers } from "./userSelectionHandlers";
import { useUserPromotion } from "./useUserPromotion";
import { UserManagementHook } from "./types";

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
  
  // Track if initial load has happened and component mounted status
  const initialLoadRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(false);
  
  // Handle search filtering - IMPORTANT: Only apply filter when users change
  // This avoids a circular dependency where filter triggers render which triggers filter
  useEffect(() => {
    if (isMountedRef.current && users.length > 0) {
      // Apply the current search filter to users whenever users change
      const filteredResults = searchQuery ? 
        filterUsersByQuery(users, searchQuery) : 
        users;
      setFilteredUsers(filteredResults);
    }
  }, [users, searchQuery, setFilteredUsers]);
  
  // Import filterUsersByQuery directly for this effect
  const filterUsersByQuery = (users: User[], query: string): User[] => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    
    if (!query || query.trim() === "") {
      return users;
    }
    
    const normalizedQuery = query.toLowerCase();
    return users.filter(
      user =>
        (user.name && user.name.toLowerCase().includes(normalizedQuery)) ||
        (user.email && user.email.toLowerCase().includes(normalizedQuery)) ||
        (user.role && user.role.toLowerCase().includes(normalizedQuery))
    );
  };
  
  // Load users on component mount but only once
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!initialLoadRef.current) {
      console.log("Initial user load triggered");
      initialLoadRef.current = true;
      
      // Initial load with a small delay to ensure component is fully mounted
      const loadTimeout = setTimeout(() => {
        loadUsers();
      }, 100);
      
      return () => {
        clearTimeout(loadTimeout);
        isMountedRef.current = false;
      };
    }
    
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
