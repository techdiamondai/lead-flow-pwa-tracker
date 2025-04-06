
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/AuthContext";

// Get user info by ID
export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user:", error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error("Exception getting user:", error);
    return null;
  }
}

// Get user name by ID with caching
const userNameCache = new Map<string, string>();

export async function getUserNameById(userId: string): Promise<string> {
  // Check cache first
  if (userNameCache.has(userId)) {
    return userNameCache.get(userId)!;
  }
  
  try {
    const user = await getUserById(userId);
    const userName = user ? user.name : `Unknown User (${userId})`;
    
    // Cache the result
    userNameCache.set(userId, userName);
    
    return userName;
  } catch (error) {
    console.error("Error getting user name:", error);
    return `Unknown User (${userId})`;
  }
}
