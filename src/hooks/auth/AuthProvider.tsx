
import React from "react";
import { AuthContext } from "./AuthContext";
import { useProfileFetch } from "./useProfileFetch";
import { useAuthState } from "./utils/authState";
import { login, register, logout, forgotPassword, resetPassword } from "./utils/authActions";
import { isAdmin } from "./utils/roleUtils";

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
    isAdmin: () => isAdmin(profile),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
