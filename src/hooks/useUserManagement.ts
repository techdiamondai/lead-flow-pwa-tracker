
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  dateJoined?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        setIsLoading(true);
        const storedUsers = localStorage.getItem("registered_users");
        if (storedUsers) {
          const parsedUsers: User[] = JSON.parse(storedUsers);
          
          // Add dateJoined if not present
          const usersWithJoinDate = parsedUsers.map(user => ({
            ...user,
            dateJoined: user.dateJoined || new Date().toISOString()
          }));
          
          setUsers(usersWithJoinDate);
          setFilteredUsers(usersWithJoinDate);
        }
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Could not load user data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [toast]);
  
  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
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
  
  const promoteSelectedToAdmin = () => {
    toast({
      description: `Promoted ${selectedUsers.length} user(s) to admin.`,
    });
    setSelectedUsers([]);
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isLoading,
    handleSelectUser,
    handleSelectAll,
    promoteSelectedToAdmin
  };
};
