
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "@/types/auth";
import { useProfileFetch } from "@/hooks/useProfileFetch";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
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

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the custom hook to fetch profile
  const { profile, isLoading: profileLoading } = useProfileFetch(user?.id);

  // Check if the user is already logged in on mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check current session
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Logged in successfully",
        description: "Welcome back!"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Registering user:", name, email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log("Registration response:", data);

      toast({
        title: "Registration successful",
        description: "Please check your email for verification and then log in."
      });

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset initiated",
        description: "Check your email for reset instructions."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // In Supabase, the token is handled through the URL/session
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please log in with your new password."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const isAdmin = () => {
    return profile?.role === "admin";
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user && !!profile,
    isLoading: isLoading || profileLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
