
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserLoadingState } from "@/components/admin/users/UserLoadingState";
import { UserEmptyState } from "@/components/admin/users/UserEmptyState";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const AdminUserManagement: React.FC = () => {
  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isLoading,
    isPromoting,
    error,
    handleSelectUser,
    handleSelectAll,
    promoteSelectedToAdmin,
    refetchUsers
  } = useUserManagement();
  
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("AdminUserManagement rendered", {
      usersLoaded: filteredUsers.length,
      isLoading,
      error
    });
    
    // Show a toast if there's an error
    if (error) {
      toast({
        title: "Error loading users",
        description: error,
        variant: "destructive"
      });
    }
    
    // Log the user list to help with debugging
    if (filteredUsers.length > 0) {
      console.log("Users available:", filteredUsers);
    }
  }, [filteredUsers, isLoading, error, toast]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button asChild>
          <a href="#admin-form-section" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        <UserSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedUsersCount={selectedUsers.length}
          onPromoteUsers={promoteSelectedToAdmin}
          isPromoting={isPromoting}
        />

        {isLoading ? (
          <UserLoadingState />
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <UserTable 
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />
        ) : (
          <UserEmptyState 
            error={error} 
            refetchUsers={refetchUsers}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};
