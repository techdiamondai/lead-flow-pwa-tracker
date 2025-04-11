
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "../types";

/**
 * Determines if the current user profile has admin role
 * Now checks against the admin_users table for stronger separation
 */
export const isAdmin = async (profile: UserProfile | null): Promise<boolean> => {
  if (!profile?.id) return false;

  try {
    // Check if user exists in admin_users table using our database function
    const { data, error } = await supabase.rpc('is_admin_user', {
      user_id: profile.id
    });

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Exception checking admin status:", error);
    return false;
  }
};

/**
 * Checks if the user has a specific role
 */
export const hasRole = (profile: UserProfile | null, role: UserRole): boolean => {
  return profile?.role === role;
};

/**
 * Creates a new admin user in the database
 * This now inserts directly into the admin_users table
 */
export const createAdminUser = async (name: string, email: string, userId: string): Promise<boolean> => {
  try {
    // Insert the user into the admin_users table
    const { error } = await supabase
      .from('admin_users')
      .insert([
        { id: userId, name, email }
      ]);

    if (error) {
      console.error("Error creating admin user:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
};
