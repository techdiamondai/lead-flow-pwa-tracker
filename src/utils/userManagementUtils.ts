
import { User } from "@/types/user.types";

/**
 * Merges users from multiple sources, avoiding duplicates
 */
export const mergeUniqueUsers = (userArrays: User[][]): User[] => {
  const allUsers: User[] = [];
  const seenIds = new Set<string>();
  
  userArrays.forEach(userArray => {
    userArray.forEach(user => {
      if (!seenIds.has(user.id)) {
        seenIds.add(user.id);
        allUsers.push(user);
      }
    });
  });
  
  return allUsers;
};

/**
 * Filters users based on a search query
 */
export const filterUsersByQuery = (users: User[], query: string): User[] => {
  if (query.trim() === "") {
    return users;
  }
  
  const normalizedQuery = query.toLowerCase();
  return users.filter(
    user =>
      user.name?.toLowerCase().includes(normalizedQuery) ||
      user.email?.toLowerCase().includes(normalizedQuery) ||
      user.role?.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Updates a user's role in the users array
 */
export const updateUserRole = (users: User[], userId: string, newRole: string): User[] => {
  return users.map(user => 
    user.id === userId 
      ? { ...user, role: newRole } 
      : user
  );
};
