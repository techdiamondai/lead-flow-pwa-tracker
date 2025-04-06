
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
