
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
 * This now uses an RPC function to avoid RLS policy issues
 */
export const createAdminUser = async (name: string, email: string, userId: string): Promise<boolean> => {
  try {
    console.log("Creating admin user with ID:", userId);
    
    // Use the RPC function to create admin user - this bypasses RLS
    const { data, error } = await supabase.rpc(
      'create_admin_user' as any, 
      {
        admin_id: userId,
        admin_name: name,
        admin_email: email
      }
    );

    if (error) {
      console.error("Error creating admin user:", error);
      return false;
    }
    
    console.log("Admin user created successfully:", data);
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
};
