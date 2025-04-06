
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isAdmin: () => boolean;
};
