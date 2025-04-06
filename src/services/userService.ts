import { User } from "@/contexts/AuthContext";

// Get user info by ID
export function getUserById(userId: string): User | null {
  try {
    const storedUsers = localStorage.getItem("registered_users");
    if (!storedUsers) return null;

    const users: User[] = JSON.parse(storedUsers);
    return users.find(u => u.id === userId) || null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Get user name by ID
export function getUserNameById(userId: string): string {
  const user = getUserById(userId);
  return user ? user.name : `Unknown User (${userId})`;
} 