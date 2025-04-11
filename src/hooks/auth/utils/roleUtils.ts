
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "../types";

/**
 * Determines if the current user profile has admin role
 * Now checks against the admin_users table for stronger separation
 */
export const isAdmin = async (profile: UserProfile | null): Promise<boolean> => {
  if (!profile?.id) {
    console.log("No profile or profile ID to check admin status");
    return false;
  }

  try {
    console.log("Checking admin status for user ID:", profile.id);
    
    // Check if user exists in admin_users table using our database function
    const { data, error } = await supabase.rpc('is_admin_user', {
      user_id: profile.id
    });

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    console.log("Admin check result:", data);
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
    // First check if the user is already an admin to prevent duplicate entries
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingAdmin) {
      console.log("User is already an admin");
      return true; // User is already an admin, so return success
    }
    
    console.log("Creating admin user with ID:", userId);
    
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
    
    console.log("Admin user created successfully");
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
};
