
import React, { createContext } from "react";
import { AuthContextType } from "./types";

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  isAdmin: () => false,
});
