
import React from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserEmptyStateProps {
  isLoading?: boolean;
  error?: string | null;
  refetchUsers?: () => void;
}

export const UserEmptyState: React.FC<UserEmptyStateProps> = ({
  isLoading = false,
  error = null,
  refetchUsers
}) => {
  return (
    <div className="text-center py-10 border rounded-md bg-muted/10">
      <UserX className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
      <h3 className="text-lg font-medium">
        {error ? "Error loading users" : "No users found"}
      </h3>
      <p className="text-muted-foreground mt-1 max-w-md mx-auto">
        {error 
          ? `There was a problem loading users: ${error}`
          : "No users match your current filters or there are no users registered in the system yet."}
      </p>
      {error && refetchUsers && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={refetchUsers}
        >
          Try again
        </Button>
      )}
    </div>
  );
};
