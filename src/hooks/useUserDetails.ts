
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Lead } from "@/models/Lead";
import { getLeads, reassignLeadsFromDeletedUser } from "@/services/leadService";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  phone?: string;
  address?: string;
  dateJoined?: string;
}

interface UserStats {
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  conversionRate: number;
}

export const useUserDetails = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLeads, setUserLeads] = useState<Lead[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalLeads: 0,
    activeLeads: 0,
    wonLeads: 0,
    conversionRate: 0,
  });
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load users from localStorage
  const loadUsers = (highlightUserId?: string | null) => {
    const storedUsers = localStorage.getItem("registered_users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);

      // Add dateJoined if not present
      const usersWithJoinDate = parsedUsers.map((user: StoredUser) => ({
        ...user,
        dateJoined: user.dateJoined || new Date().toISOString(),
      }));

      setUsers(usersWithJoinDate);

      // If there's a highlighted user from query params, select them
      if (highlightUserId) {
        const highlightedUser = usersWithJoinDate.find(
          (user: StoredUser) => user.id === highlightUserId
        );
        if (highlightedUser) {
          setSelectedUser(highlightedUser);
          fetchUserLeadsAndStats(highlightedUser.id);
          setIsViewDialogOpen(true);
        }
      }
    }
    setIsLoading(false);
  };

  // Function to fetch leads for a specific user
  const fetchUserLeadsAndStats = async (userId: string) => {
    try {
      const allLeads = await getLeads();
      const userFilteredLeads = allLeads.filter(
        (lead) => lead.assigned_to === userId
      );

      setUserLeads(userFilteredLeads);

      // Calculate stats
      const totalLeads = userFilteredLeads.length;
      const activeLeads = userFilteredLeads.filter(
        (lead) => !["won", "lost"].includes(lead.current_stage)
      ).length;
      const wonLeads = userFilteredLeads.filter(
        (lead) => lead.current_stage === "won"
      ).length;
      const closedLeads = userFilteredLeads.filter((lead) =>
        ["won", "lost"].includes(lead.current_stage)
      ).length;
      const conversionRate =
        closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0;

      setUserStats({
        totalLeads,
        activeLeads,
        wonLeads,
        conversionRate,
      });
    } catch (error) {
      console.error("Error fetching user leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user leads data.",
        variant: "destructive",
      });
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (userId: string) => {
    // Don't allow deleting yourself
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Reassign any leads from the deleted user to the admin
      if (currentUser) {
        await reassignLeadsFromDeletedUser(userId, currentUser.id);
      }

      // Then delete the user
      const updatedUsers = users.filter((user) => user.id !== userId);
      localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);

      toast({
        title: "User Deleted",
        description:
          "The user has been successfully removed from the system and their leads have been reassigned.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to view user details
  const handleViewUser = (user: StoredUser) => {
    setSelectedUser(user);
    fetchUserLeadsAndStats(user.id);
    setIsViewDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const handleDeleteConfirm = (user: StoredUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    users,
    selectedUser,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isLoading,
    userLeads,
    userStats,
    loadUsers,
    handleDeleteUser,
    handleViewUser,
    handleDeleteConfirm,
  };
};

export type { StoredUser, UserStats };
