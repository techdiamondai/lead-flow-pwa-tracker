
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserLoadingState } from "@/components/admin/users/UserLoadingState";
import { UserEmptyState } from "@/components/admin/users/UserEmptyState";

export const AdminUserManagement: React.FC = () => {
  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    isLoading,
    handleSelectUser,
    handleSelectAll,
    promoteSelectedToAdmin
  } = useUserManagement();
  
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
        />

        {isLoading ? (
          <UserLoadingState />
        ) : filteredUsers.length === 0 ? (
          <UserEmptyState />
        ) : (
          <UserTable 
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />
        )}
      </CardContent>
    </Card>
  );
};
