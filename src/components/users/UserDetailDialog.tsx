
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StoredUser, UserStats } from "@/hooks/useUserDetails";
import { Lead } from "@/models/Lead";
import { formatDate, getStageBadgeVariant } from "@/utils/userFormatUtils";
import { Trash2, UserCheck, Mail, Phone, Building, Calendar, Eye } from "lucide-react";

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: StoredUser | null;
  userLeads: Lead[];
  userStats: UserStats;
  onDelete: (user: StoredUser) => void;
  currentUserId?: string;
}

export const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  userLeads,
  userStats,
  onDelete,
  currentUserId,
}) => {
  const navigate = useNavigate();

  if (!selectedUser) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          // Clear URL parameter when dialog is closed
          const url = new URL(window.location.href);
          url.searchParams.delete("highlight");
          window.history.replaceState({}, "", url.toString());
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

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">
              Leads ({userLeads.length})
            </TabsTrigger>
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
                    <Badge
                      variant={selectedUser.role === "admin" ? "default" : "outline"}
                    >
                      {selectedUser.role}
                    </Badge>
                    <span className="text-xs">
                      Joined{" "}
                      {selectedUser.dateJoined
                        ? formatDate(selectedUser.dateJoined)
                        : "Unknown date"}
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
                      {userLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">
                            {lead.name}
                          </TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                getStageBadgeVariant(lead.current_stage) as any
                              }
                            >
                              {lead.current_stage}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(lead.updated_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onOpenChange(false);
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

        <DialogFooter className="mt-6">
          {selectedUser && selectedUser.id !== currentUserId && (
            <Button
              variant="destructive"
              className="mr-auto"
              onClick={() => {
                onOpenChange(false);
                onDelete(selectedUser);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
