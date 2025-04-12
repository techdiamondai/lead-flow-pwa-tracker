
import { useState } from "react";
import { User } from "@/types/user.types";
import { UserManagementState } from "./types";

/**
 * Creates and manages the state for user management with simplified state updates
 * to prevent circular dependencies and render loops
 */
export const useUserManagementStore = (): [
  UserManagementState,
  {
    setUsers: (users: User[]) => void;
    setFilteredUsers: (users: User[]) => void;
    setSearchQuery: (query: string) => void;
    setSelectedUsers: (userIds: string[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setIsPromoting: (isPromoting: boolean) => void;
    updateUserRole: (userId: string, role: string) => void;
  }
] => {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    filteredUsers: [],
    searchQuery: "",
    selectedUsers: [],
    isLoading: true,
    error: null,
    isPromoting: false
  });

  // Simplified state setters that don't depend on previous state
  const setUsers = (users: User[]) => {
    setState(prev => ({ ...prev, users }));
  };

  const setFilteredUsers = (filteredUsers: User[]) => {
    setState(prev => ({ ...prev, filteredUsers }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery }));
  };

  const setSelectedUsers = (selectedUsers: string[]) => {
    setState(prev => ({ ...prev, selectedUsers }));
  };

  const setIsLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setIsPromoting = (isPromoting: boolean) => {
    setState(prev => ({ ...prev, isPromoting }));
  };

  // Update user role with a direct object update to prevent circular dependencies
  const updateUserRole = (userId: string, newRole: string) => {
    setState(prev => {
      // Create copies of the arrays to avoid mutation
      const updatedUsers = prev.users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      
      const updatedFilteredUsers = prev.filteredUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      
      return {
        ...prev,
        users: updatedUsers,
        filteredUsers: updatedFilteredUsers
      };
    });
  };

  return [
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
  ];
};
