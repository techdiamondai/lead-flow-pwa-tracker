
import { useEffect, useRef } from "react";
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
  // Add debounce ref to prevent excessive filtering
  const filterTimeoutRef = useRef<number | null>(null);
  
  // Filter users based on search query
  useEffect(() => {
    // Clear any pending filter operation
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Validate input
    if (!users || !Array.isArray(users)) {
      console.log("Invalid users array in useUserSearchFilter");
      return;
    }
    
    if (searchQuery === undefined) {
      console.log("Search query is undefined, skipping filter");
      return;
    }
    
    // Debounce filter operation to prevent excessive rendering
    filterTimeoutRef.current = window.setTimeout(() => {
      console.log(`Filtering ${users.length} users with query: "${searchQuery}"`);
      const filteredResults = filterUsersByQuery(users, searchQuery);
      setFilteredUsers(filteredResults);
      filterTimeoutRef.current = null;
    }, 100);
    
    // Clean up timeout
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [searchQuery, users, setFilteredUsers]);
};
