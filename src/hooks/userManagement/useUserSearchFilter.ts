
import { useEffect } from "react";
import { filterUsersByQuery } from "@/utils/userManagementUtils";
import { User } from "@/types/user.types";

/**
 * Hook for handling user search and filtering
 */
export const useUserSearchFilter = (
  users: User[],
  searchQuery: string,
  setFilteredUsers: (users: User[]) => void
) => {
  // Filter users based on search query
  useEffect(() => {
    setFilteredUsers(filterUsersByQuery(users, searchQuery));
  }, [searchQuery, users, setFilteredUsers]);
};
