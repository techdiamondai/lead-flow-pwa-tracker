
import { User } from "@/types/user.types";

/**
 * Merges users from multiple sources, avoiding duplicates
 */
export const mergeUniqueUsers = (userArrays: User[][]): User[] => {
  const allUsers: User[] = [];
  const seenIds = new Set<string>();
  
  userArrays.forEach(userArray => {
    if (!userArray || !Array.isArray(userArray)) {
      console.warn("Invalid user array provided to mergeUniqueUsers:", userArray);
      return;
    }
    
    userArray.forEach(user => {
      if (!user || !user.id) {
        console.warn("Invalid user object found:", user);
        return;
      }
      
      if (!seenIds.has(user.id)) {
        seenIds.add(user.id);
        allUsers.push(user);
      }
    });
  });
  
  console.log(`🔄 Merged ${allUsers.length} unique users from ${userArrays.length} sources`);
  return allUsers;
};

/**
 * Filters users based on a search query
 */
export const filterUsersByQuery = (users: User[], query: string): User[] => {
  if (!users || !Array.isArray(users)) {
    console.warn("Invalid users array provided to filterUsersByQuery");
    return [];
  }
  
  if (!query || query.trim() === "") {
    return users;
  }
  
  const normalizedQuery = query.toLowerCase();
  const filtered = users.filter(
    user =>
      (user.name && user.name.toLowerCase().includes(normalizedQuery)) ||
      (user.email && user.email.toLowerCase().includes(normalizedQuery)) ||
      (user.role && user.role.toLowerCase().includes(normalizedQuery))
  );
  
  console.log(`🔍 Filtered ${users.length} users to ${filtered.length} results for query: "${query}"`);
  return filtered;
};

/**
 * Updates a user's role in the users array
 */
export const updateUserRole = (users: User[], userId: string, newRole: string): User[] => {
  if (!users || !Array.isArray(users)) {
    console.warn("Invalid users array provided to updateUserRole");
    return [];
  }
  
  const updated = users.map(user => 
    user.id === userId 
      ? { ...user, role: newRole } 
      : user
  );
  
  console.log(`🔄 Updated role for user ${userId} to "${newRole}"`);
  return updated;
};

/**
 * Ensures user data has all required fields
 */
export const sanitizeUserData = (users: User[]): User[] => {
  if (!users || !Array.isArray(users)) {
    console.warn("Invalid users array provided to sanitizeUserData");
    return [];
  }
  
  const sanitized = users.map(user => ({
    id: user.id || `unknown-${Date.now()}`,
    name: user.name || 'Unknown User',
    email: user.email || 'unknown@example.com',
    role: user.role || 'user',
    dateJoined: user.dateJoined || new Date().toISOString()
  }));
  
  console.log(`🧹 Sanitized ${users.length} user records`);
  return sanitized;
};
