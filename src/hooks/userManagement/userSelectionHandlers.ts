
import { User } from "@/types/user.types";

/**
 * Handlers for user selection actions
 */
export const createUserSelectionHandlers = (
  filteredUsers: User[],
  selectedUsers: string[],
  setSelectedUsers: (userIds: string[]) => void
) => {
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return {
    handleSelectUser,
    handleSelectAll
  };
};
