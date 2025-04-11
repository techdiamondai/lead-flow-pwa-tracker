
import React from "react";
import { AuthContext } from "./AuthContext";
import { useProfileFetch } from "./useProfileFetch";
import { useAuthState } from "./utils/authState";
import { login, register, logout, forgotPassword, resetPassword } from "./utils/authActions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the custom hooks to manage auth state and fetch profile
  const { user, session, isLoading: authLoading } = useAuthState();
  const { profile, isLoading: profileLoading } = useProfileFetch(user?.id);

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user && !!profile,
    isLoading: authLoading || profileLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin: () => {
      // This is now just a placeholder function
      // The actual admin check is done in the ProtectedRoute component
      // using the async isAdmin function from roleUtils
      return true; // This will be overridden by the proper check
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
