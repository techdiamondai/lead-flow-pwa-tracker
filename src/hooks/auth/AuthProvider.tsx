
import React, { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useProfileFetch } from "./useProfileFetch";
import { useAuthState } from "./utils/authState";
import { login, register, logout, forgotPassword, resetPassword } from "./utils/authActions";
import { isAdmin as checkIsAdmin } from "./utils/roleUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the custom hooks to manage auth state and fetch profile
  const { user, session, isLoading: authLoading } = useAuthState();
  const { profile, isLoading: profileLoading } = useProfileFetch(user?.id);
  const [cachedAdminStatus, setCachedAdminStatus] = useState<boolean | null>(null);

  // Check and cache admin status when profile changes
  const checkAdminStatus = useCallback(async () => {
    if (!user || !profile) {
      setCachedAdminStatus(false);
      return;
    }
    
    try {
      const adminStatus = await checkIsAdmin(profile);
      console.log("Admin status check in AuthProvider:", adminStatus, "for user:", profile.id);
      setCachedAdminStatus(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("Error checking admin status in AuthProvider:", error);
      setCachedAdminStatus(false);
      return false;
    }
  }, [user, profile]);

  // Update admin status when profile changes
  useEffect(() => {
    if (profile) {
      checkAdminStatus();
    }
  }, [profile, checkAdminStatus]);

  // Create the context value with all auth functionality
  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user && !!session, // Check for both user and session
    isLoading: authLoading || profileLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    // Use cached admin status when available, otherwise check directly
    isAdmin: async () => {
      if (cachedAdminStatus !== null) {
        return cachedAdminStatus;
      }
      return await checkAdminStatus();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
