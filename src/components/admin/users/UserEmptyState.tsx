
import React from "react";
import { UserX } from "lucide-react";

export const UserEmptyState: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-md bg-muted/10">
      <UserX className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
      <h3 className="text-lg font-medium">No users found</h3>
      <p className="text-muted-foreground mt-1 max-w-md mx-auto">
        No users match your current filters or there are no users registered in the system yet.
      </p>
    </div>
  );
};
