
import { useEffect, useRef } from "react";
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
    
    // Guard clause - if users array is invalid, do nothing
    if (!users || !Array.isArray(users)) {
      console.log("Invalid users array in useUserSearchFilter");
      return;
    }
    
    // Guard clause - if searchQuery is undefined, do nothing
    if (searchQuery === undefined) {
      console.log("Search query is undefined, skipping filter");
      return;
    }
    
    // Debounce filter operation to prevent excessive rendering
    filterTimeoutRef.current = window.setTimeout(() => {
      console.log(`Filtering ${users.length} users with query: "${searchQuery}"`);
      
      // Apply filtering directly here instead of importing the function
      const filteredResults = filterByQuery(users, searchQuery);
      setFilteredUsers(filteredResults);
      filterTimeoutRef.current = null;
    }, 300); // Increased debounce time to prevent rapid re-renders
    
    // Clean up timeout
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [searchQuery, users, setFilteredUsers]);
};

// Local implementation of filterUsersByQuery to avoid circular imports
const filterByQuery = (users: User[], query: string): User[] => {
  if (!users || !Array.isArray(users)) return [];
  
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
