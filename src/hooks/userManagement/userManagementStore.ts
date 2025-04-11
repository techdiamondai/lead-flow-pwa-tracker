
import { useState, useCallback } from "react";
import { User } from "@/types/user.types";
import { UserManagementState } from "./types";
import { filterUsersByQuery, updateUserRole } from "@/utils/userManagementUtils";

/**
 * Creates and manages the state for user management
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
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  const updateUserRoleInState = useCallback((userId: string, newRole: string) => {
    setUsers(prevUsers => updateUserRole(prevUsers, userId, newRole));
    setFilteredUsers(prevFiltered => {
      // If search is active, update the filtered view too
      if (searchQuery) {
        return updateUserRole(prevFiltered, userId, newRole);
      }
      // Using the previous state instead of referencing the current users state
      // which could cause an infinite loop
      return filterUsersByQuery(updateUserRole(prevFiltered, userId, newRole), searchQuery);
    });
  }, [searchQuery]);

  return [
    { users, filteredUsers, searchQuery, selectedUsers, isLoading, error, isPromoting },
    { 
      setUsers, 
      setFilteredUsers, 
      setSearchQuery, 
      setSelectedUsers, 
      setIsLoading, 
      setError, 
      setIsPromoting,
      updateUserRole: updateUserRoleInState
    }
  ];
};
