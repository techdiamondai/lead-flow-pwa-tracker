
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";

export type UserRole = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
}

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isAdmin: () => boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
          // Verify and decode the token
          const payload = jwtDecode<JWTPayload>(storedToken);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp < currentTime) {
            throw new Error("Token expired");
          }
          
          // Set user from token payload
          setUser({
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            role: payload.role
          });
          
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("auth_token");
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock users for demonstration purposes
  const mockUsers = [
    { id: "1", email: "admin@example.com", password: "admin", name: "Admin User", role: "admin" as UserRole },
    { id: "2", email: "user@example.com", password: "user", name: "Regular User", role: "user" as UserRole }
  ];

  // Mock registered users storage
  const getRegisteredUsers = (): Array<typeof mockUsers[0]> => {
    const stored = localStorage.getItem("registered_users");
    return stored ? JSON.parse(stored) : [...mockUsers];
  };

  const saveRegisteredUsers = (users: Array<typeof mockUsers[0]>) => {
    localStorage.setItem("registered_users", JSON.stringify(users));
  };

  // Generate a JWT token
  const generateToken = (user: Omit<typeof mockUsers[0], "password">) => {
    // In a real app, this would be done on the server
    const payload: JWTPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    };
    
    // This is a very simplified JWT - in a real app use a library or backend
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${payloadBase64}-SECRET`); // Mock signature
    
    return `${header}.${payloadBase64}.${signature}`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you'd validate credentials against a backend API
      const users = getRegisteredUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate JWT token
      const newToken = generateToken(userWithoutPassword);
      localStorage.setItem("auth_token", newToken);
      
      setUser(userWithoutPassword);
      setToken(newToken);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userWithoutPassword.name}!`
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = getRegisteredUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role: "user" as UserRole
      };

      // Save user
      saveRegisteredUsers([...users, newUser]);

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in."
      });

      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const users = getRegisteredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error("No account found with this email");
      }
      
      // Generate a reset token (in a real app, this would be more secure)
      const resetToken = btoa(`${user.id}-${Date.now()}-RESET`);
      
      // Store token in localStorage (in a real app, this would be in a database with expiry)
      const resetRequests = JSON.parse(localStorage.getItem("password_reset_tokens") || "{}");
      resetRequests[resetToken] = {
        userId: user.id,
        email: user.email,
        expires: Date.now() + 3600000 // 1 hour
      };
      localStorage.setItem("password_reset_tokens", JSON.stringify(resetRequests));
      
      // In a real app, send an email with reset link
      console.log("Password reset token:", resetToken);
      
      toast({
        title: "Password reset initiated",
        description: "Check your email for reset instructions. (For demo: check the console for the token)"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // Verify token
      const resetRequests = JSON.parse(localStorage.getItem("password_reset_tokens") || "{}");
      const request = resetRequests[token];
      
      if (!request || request.expires < Date.now()) {
        throw new Error("Invalid or expired reset token");
      }
      
      // Update password
      const users = getRegisteredUsers();
      const updatedUsers = users.map(user => {
        if (user.id === request.userId) {
          return { ...user, password: newPassword };
        }
        return user;
      });
      
      saveRegisteredUsers(updatedUsers);
      
      // Remove used token
      delete resetRequests[token];
      localStorage.setItem("password_reset_tokens", JSON.stringify(resetRequests));
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please log in with your new password."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
