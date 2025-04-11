
import { UserProfile, UserRole } from "../types";

/**
 * Determines if the current user profile has admin role
 */
export const isAdmin = (profile: UserProfile | null): boolean => {
  return profile?.role === "admin";
};

/**
 * Checks if the user has a specific role
 */
export const hasRole = (profile: UserProfile | null, role: UserRole): boolean => {
  return profile?.role === role;
};

/**
 * Creates a new admin user in the database
 * Note: This should only be called from a secured environment,
 * not from the client-side application
 */
export const createAdminUser = async (name: string, email: string, userId: string): Promise<boolean> => {
  try {
    // This is a placeholder function that would typically be implemented
    // in a secure backend environment or through direct database operations
    console.log(`Admin user creation would occur here for ${name} (${email}) with ID ${userId}`);
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
};
