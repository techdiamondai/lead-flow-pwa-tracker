
// This file handles Supabase migration status

import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/models/Lead";

// Function to check Supabase connection status
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('leads').select('id').limit(1);
    return error === null;
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return false;
  }
}

// Check if migration is needed (now always returns false as we're fully on Supabase)
export async function checkNeedsMigration(): Promise<boolean> {
  // We're now fully on Supabase, so no migration is needed
  return false;
}

// This function is kept for backwards compatibility but now checks connection
export async function migrateLeadsToSupabase(userId: string): Promise<boolean> {
  console.log("All data is now stored in Supabase. Checking connection...");
  const connected = await checkSupabaseConnection();
  
  if (!connected) {
    console.error("Cannot connect to Supabase. Please check your internet connection.");
    return false;
  }
  
  return true;
}

export const migrationService = {
  migrateLeadsToSupabase,
  checkNeedsMigration,
  checkSupabaseConnection
};
