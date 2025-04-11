
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/hooks/userManagement"; // Updated import path

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric", 
        month: "short", 
        day: "numeric"
      }).format(date);
    } catch (e) {
      return "Unknown Date";
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="w-10 px-4 py-3 text-left">
              <Checkbox 
                checked={selectedUsers.length > 0 && selectedUsers.length === users.length}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Joined</th>
            <th className="px-4 py-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className={`hover:bg-muted/50 ${
                selectedUsers.includes(user.id) ? "bg-primary/5" : ""
              }`}
            >
              <td className="px-4 py-3">
                <Checkbox 
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                  aria-label={`Select ${user.name}`}
                />
              </td>
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {formatDate(user.dateJoined)}
              </td>
              <td className="px-4 py-3 text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigate(`/admin/users?highlight=${user.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
