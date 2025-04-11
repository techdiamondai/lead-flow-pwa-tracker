
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";

/**
 * Logs in a user with email and password
 */
export const login = async (email: string, password: string, isAdminLogin = false): Promise<boolean> => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    // For admin logins, verify that the user actually has admin role
    if (isAdminLogin) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have administrator privileges",
          variant: "destructive"
        });
        
        // Log them out since they don't have admin privileges
        await supabase.auth.signOut();
        return false;
      }
    }

    toast({
      title: "Logged in successfully",
      description: isAdminLogin 
        ? "Welcome to the admin portal"
        : "Welcome back!"
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
    console.log("Registering user in authActions:", name, email);
    
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

    // Check if user was created successfully
    if (data?.user) {
      toast({
        title: "Registration successful",
        description: "Please check your email for verification and then log in."
      });
      return true;
    } else {
      throw new Error("User registration failed");
    }
  } catch (error: any) {
    console.error("Registration error in authActions:", error);
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
