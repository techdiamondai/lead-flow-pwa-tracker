
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
    if (!users || !Array.isArray(users)) {
      console.log("Invalid users array in useUserSearchFilter");
      return;
    }
    
    if (searchQuery === undefined) {
      console.log("Search query is undefined, skipping filter");
      return;
    }
    
    console.log(`Filtering ${users.length} users with query: "${searchQuery}"`);
    const filteredResults = filterUsersByQuery(users, searchQuery);
    setFilteredUsers(filteredResults);
  }, [searchQuery, users, setFilteredUsers]);
};
