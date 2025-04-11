
import React from "react";
import { AuthContext } from "./AuthContext";
import { useProfileFetch } from "./useProfileFetch";
import { useAuthState } from "./utils/authState";
import { login, register, logout, forgotPassword, resetPassword } from "./utils/authActions";
import { isAdmin as checkIsAdmin } from "./utils/roleUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the custom hooks to manage auth state and fetch profile
  const { user, session, isLoading: authLoading } = useAuthState();
  const { profile, isLoading: profileLoading } = useProfileFetch(user?.id);

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
    // Fix: Ensure this properly returns a Promise<boolean> and properly checks admin status
    isAdmin: async () => {
      if (!user || !profile) return false;
      const adminStatus = await checkIsAdmin(profile);
      console.log("Admin status check result:", adminStatus, "for user:", profile.id);
      return adminStatus;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
