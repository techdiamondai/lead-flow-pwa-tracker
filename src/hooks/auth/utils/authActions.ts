
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";

/**
 * Logs in a user with email and password
 */
export const login = async (email: string, password: string): Promise<boolean> => {
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

/**
 * Registers a new user with name, email, and password
 */
export const register = async (name: string, email: string, password: string): Promise<boolean> => {
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

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  toast({
    title: "Logged out",
    description: "You have been logged out successfully"
  });
};

/**
 * Sends a password reset email to the provided email address
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
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

/**
 * Resets a user's password using a token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
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
