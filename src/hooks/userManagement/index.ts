import { useEffect, useRef } from "react";
import { useUserManagementStore } from "./userManagementStore";
import { useUsersLoader } from "./useUsersLoader";
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
  const isMountedRef = useRef<boolean>(true);
  
  // Apply search filter when users or query changes
  useEffect(() => {
    if (!isMountedRef.current || users.length === 0) return;
    
    // If no search query, just set filtered users to all users
    if (!searchQuery || searchQuery.trim() === "") {
      setFilteredUsers(users);
      return;
    }
    
    // Otherwise apply the filter
    const normalizedQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      user =>
        (user.name && user.name.toLowerCase().includes(normalizedQuery)) ||
        (user.email && user.email.toLowerCase().includes(normalizedQuery)) ||
        (user.role && user.role.toLowerCase().includes(normalizedQuery))
    );
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, setFilteredUsers]);
  
  // Load users only once on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial load only once
    if (!initialLoadRef.current) {
      console.log("Initial user load triggered");
      initialLoadRef.current = true;
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
