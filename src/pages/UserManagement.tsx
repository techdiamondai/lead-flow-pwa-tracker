
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/contexts/AuthContext";
import { getLeads, reassignLeadsFromDeletedUser } from "@/services/leadService";
import { Lead } from "@/models/Lead";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Trash2, UserCog, ArrowLeft, UserCheck, Mail, Phone, Building, Calendar } from "lucide-react";

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const UserManagement: React.FC = () => {
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
    conversionRate: 0
  });
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

    const loadUsers = () => {
      const storedUsers = localStorage.getItem("registered_users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        
        // Add dateJoined if not present
        const usersWithJoinDate = parsedUsers.map((user: StoredUser) => ({
          ...user,
          dateJoined: user.dateJoined || new Date().toISOString()
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

    loadUsers();
  }, [isAdmin, navigate, toast, highlightUserId]);

  // Function to fetch leads for a specific user
  const fetchUserLeadsAndStats = async (userId: string) => {
    try {
      const allLeads = await getLeads();
      const userFilteredLeads = allLeads.filter(lead => lead.assigned_to === userId);
      
      setUserLeads(userFilteredLeads);
      
      // Calculate stats
      const totalLeads = userFilteredLeads.length;
      const activeLeads = userFilteredLeads.filter(lead => 
        !["won", "lost"].includes(lead.current_stage)
      ).length;
      const wonLeads = userFilteredLeads.filter(lead => lead.current_stage === "won").length;
      const closedLeads = userFilteredLeads.filter(lead => 
        ["won", "lost"].includes(lead.current_stage)
      ).length;
      const conversionRate = closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0;
      
      setUserStats({
        totalLeads,
        activeLeads,
        wonLeads,
        conversionRate
      });
      
    } catch (error) {
      console.error("Error fetching user leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user leads data.",
        variant: "destructive"
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
    fetchUserLeadsAndStats(user.id);
    setIsViewDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const handleDeleteConfirm = (user: StoredUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
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

  // Get badge variant for lead stage
  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "qualified":
        return "outline";
      case "proposal":
        return "secondary";
      case "negotiation":
        return "default";
      case "won":
        return "success";
      case "lost":
        return "destructive";
      default:
        return "default";
    }
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
                    <TableHead>Joined</TableHead>
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
                      <TableCell>{user.dateJoined ? formatDate(user.dateJoined) : "Unknown"}</TableCell>
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

      {/* Enhanced User Details Dialog */}
      <Dialog 
        open={isViewDialogOpen} 
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) {
            // Clear URL parameter when dialog is closed
            const url = new URL(window.location.href);
            url.searchParams.delete('highlight');
            window.history.replaceState({}, '', url.toString());
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">User Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leads">Leads ({userLeads.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant={selectedUser.role === "admin" ? "default" : "outline"}>
                          {selectedUser.role}
                        </Badge>
                        <span className="text-xs">
                          Joined {selectedUser.dateJoined ? formatDate(selectedUser.dateJoined) : "Unknown date"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm">
                        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>{selectedUser.phone || "No phone number"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>{selectedUser.address || "No address provided"}</span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>User ID: {selectedUser.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Total Leads
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {userStats.totalLeads}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Active Leads
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {userStats.activeLeads}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Won Leads
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {userStats.wonLeads}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Conversion Rate
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {userStats.conversionRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="leads">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lead Assignments</h3>
                  {userLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border rounded-md">
                      <p>This user doesn't have any leads assigned.</p>
                    </div>
                  ) : (
                    <div className="border rounded-md max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Lead Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userLeads.map(lead => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-medium">{lead.name}</TableCell>
                              <TableCell>{lead.company}</TableCell>
                              <TableCell>
                                <Badge variant={getStageBadgeVariant(lead.current_stage) as any}>
                                  {lead.current_stage}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(lead.updated_at)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    setIsViewDialogOpen(false);
                                    navigate(`/leads/${lead.id}`);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="mt-6">
            {selectedUser && selectedUser.id !== currentUser?.id && (
              <Button 
                variant="destructive" 
                className="mr-auto"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleDeleteConfirm(selectedUser);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            )}
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
