import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/contexts/AuthContext";
import { reassignLeadsFromDeletedUser } from "@/services/leadService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, UserCog, ArrowLeft } from "lucide-react";

interface StoredUser extends User {
  password: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

    const loadUsers = () => {
      const storedUsers = localStorage.getItem("registered_users");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      setIsLoading(false);
    };

    loadUsers();
  }, [isAdmin, navigate, toast]);

  // Function to delete a user
  const handleDeleteUser = async (userId: string) => {
    // Don't allow deleting yourself
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account.",
        variant: "destructive"
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
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);

      toast({
        title: "User Deleted",
        description: "The user has been successfully removed from the system and their leads have been reassigned."
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to view user details
  const handleViewUser = (user: StoredUser) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const handleDeleteConfirm = (user: StoredUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

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
          {isLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
              <div className="animate-pulse h-10 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteConfirm(user)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">User ID</div>
                  <div className="text-sm bg-muted p-2 rounded-md">{selectedUser.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Role</div>
                  <div>
                    <Badge variant={selectedUser.role === "admin" ? "default" : "outline"} className="text-sm">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Name</div>
                <div className="text-sm bg-muted p-2 rounded-md">{selectedUser.name}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Email</div>
                <div className="text-sm bg-muted p-2 rounded-md">{selectedUser.email}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.name}"`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement; 