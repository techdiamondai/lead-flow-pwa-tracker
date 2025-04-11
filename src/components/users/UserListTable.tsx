
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { StoredUser } from "@/hooks/useUserDetails";
import { formatDate } from "@/utils/userFormatUtils";

interface UserListTableProps {
  users: StoredUser[];
  currentUserId?: string;
  isLoading: boolean;
  onViewUser: (user: StoredUser) => void;
  onDeleteUser: (user: StoredUser) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  currentUserId,
  isLoading,
  onViewUser,
  onDeleteUser
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
        <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
        <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <td className="font-medium p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-4">{formatDate(user.dateJoined)}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onViewUser(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user.id !== currentUserId && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
