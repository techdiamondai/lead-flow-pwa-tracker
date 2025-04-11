
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserDetails } from "@/hooks/useUserDetails";
import { UserListTable } from "@/components/users/UserListTable";
import { UserDetailDialog } from "@/components/users/UserDetailDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { UserCog, ArrowLeft } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const UserManagement: React.FC = () => {
  const {
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
  } = useUserDetails();
  
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const query = useQuery();
  const highlightUserId = query.get("highlight");

  // Load users from localStorage
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view user management.",
        variant: "destructive"
      });
      navigate("/dashboard");
      return;
    }

    loadUsers(highlightUserId);
  }, [isAdmin, navigate, toast, highlightUserId, loadUsers]);

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground">
            View and manage system users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="h-5 w-5 mr-2" />
            System Users
          </CardTitle>
          <CardDescription>
            Total Users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserListTable
            users={users}
            currentUserId={currentUser?.id}
            isLoading={isLoading}
            onViewUser={handleViewUser}
            onDeleteUser={handleDeleteConfirm}
          />
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <UserDetailDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        selectedUser={selectedUser}
        userLeads={userLeads}
        userStats={userStats}
        onDelete={handleDeleteConfirm}
        currentUserId={currentUser?.id}
      />

      {/* Delete User Confirmation Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userName={selectedUser?.name}
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
      />
    </div>
  );
};

export default UserManagement;
