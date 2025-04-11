
import { User } from "@/types/user.types";

export interface UserManagementState {
  users: User[];
  filteredUsers: User[];
  searchQuery: string;
  selectedUsers: string[];
  isLoading: boolean;
  error: string | null;
  isPromoting: boolean;
}

export interface UserManagementActions {
  setSearchQuery: (query: string) => void;
  handleSelectUser: (userId: string) => void;
  handleSelectAll: () => void;
  promoteSelectedToAdmin: () => Promise<void>;
  refetchUsers: () => Promise<void>;
}

export type UserManagementHook = UserManagementState & UserManagementActions;
