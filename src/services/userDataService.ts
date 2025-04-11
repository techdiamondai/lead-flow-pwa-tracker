
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user.types";

/**
 * Fetches user profiles from Supabase
 */
export const fetchUserProfiles = async (): Promise<User[]> => {
  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, role, created_at');
      
    console.log("📊 Profiles fetch result:", { data: profilesData?.length || 0, error: profilesError?.message });
      
    if (profilesError) {
      console.error("⚠️ Error loading profiles:", profilesError);
      throw new Error(`Database error: ${profilesError.message}`);
    }

    if (!profilesData || profilesData.length === 0) {
      console.log("⚠️ No profiles found in database");
      return [];
    }
    
    const users: User[] = profilesData.map(profile => ({
      id: profile.id,
      name: profile.name || 'Unknown',
      email: profile.email || 'Unknown',
      role: profile.role || 'user',
      dateJoined: profile.created_at
    }));
    
    console.log("✅ Successfully loaded users from profiles:", users.length);
    return users;
  } catch (error) {
    console.error("❌ Failed to fetch user profiles:", error);
    throw error;
  }
};

/**
 * Fetches admin users from Supabase
 */
export const fetchAdminUsers = async (): Promise<User[]> => {
  try {
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, name, email, created_at');
      
    console.log("📊 Admin users fetch result:", { data: adminData?.length || 0, error: adminError?.message });
    
    if (adminError) {
      console.error("⚠️ Error loading admin users:", adminError);
      // Don't throw, we can continue with other users
      return [];
    }

    if (!adminData || adminData.length === 0) {
      console.log("⚠️ No admin users found in database");
      return [];
    }
    
    const adminUsers: User[] = adminData.map(admin => ({
      id: admin.id,
      name: admin.name || 'Unknown',
      email: admin.email || 'Unknown',
      role: 'admin',
      dateJoined: admin.created_at
    }));
    
    console.log("✅ Successfully loaded admin users:", adminUsers.length);
    return adminUsers;
  } catch (error) {
    console.error("❌ Failed to fetch admin users:", error);
    return []; // Return empty array to avoid breaking the app
  }
};

/**
 * Gets local users from localStorage
 */
export const getLocalUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem("registered_users");
    if (!storedUsers) {
      console.log("⚠️ No users found in localStorage");
      return [];
    }

    const parsedUsers: User[] = JSON.parse(storedUsers);
    console.log("📋 Local storage users found:", parsedUsers.length);
    
    return parsedUsers.map(user => ({
      ...user,
      dateJoined: user.dateJoined || new Date().toISOString()
    }));
  } catch (error) {
    console.error("⚠️ Error parsing local users:", error);
    return [];
  }
};

/**
 * Creates a test user for fallback
 */
export const createTestUser = (isFallback = false): User => {
  const timestamp = new Date().toISOString();
  const testUser: User = {
    id: isFallback ? "test-user-fallback-" + Date.now() : "test-user-id-" + Date.now(),
    name: isFallback ? "Test Fallback User" : "Test User",
    email: isFallback ? `fallback_${Date.now()}@example.com` : `test_${Date.now()}@example.com`,
    role: "user",
    dateJoined: timestamp
  };
  
  console.log("🆕 Created test user:", testUser);
  return testUser;
};

/**
 * Saves a test user to localStorage
 */
export const saveTestUserToLocalStorage = (testUser: User): void => {
  try {
    // Get existing users
    const existingUsers = getLocalUsers();
    // Add the new test user
    const updatedUsers = [...existingUsers, testUser];
    
    localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
    console.log("💾 Saved test user to localStorage");
  } catch (err) {
    console.error("⚠️ Failed to save test user to localStorage:", err);
  }
};

/**
 * Saves all users to localStorage
 */
export const saveUsersToLocalStorage = (users: User[]): void => {
  try {
    localStorage.setItem("registered_users", JSON.stringify(users));
    console.log("💾 Saved users to localStorage:", users.length);
  } catch (err) {
    console.error("⚠️ Failed to save users to localStorage:", err);
  }
};
