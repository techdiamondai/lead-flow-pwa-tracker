
import { useEffect } from "react";
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
  
  // Handle search filtering
  useUserSearchFilter(users, searchQuery, setFilteredUsers);
  
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
  
  // Load users on component mount
  useEffect(() => {
    loadUsers();
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
