
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, Search, UserPlus, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  dateJoined?: string;
}

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
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
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    description: `Promoted ${selectedUsers.length} user(s) to admin.`,
                  });
                  setSelectedUsers([]);
                }}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Promote to Admin
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <Checkbox 
                      checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onCheckedChange={handleSelectAll}
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
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-muted/50 ${
                      selectedUsers.includes(user.id) ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
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
        )}
      </CardContent>
    </Card>
  );
};
