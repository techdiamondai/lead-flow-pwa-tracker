
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { Loader2 } from "lucide-react";

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUsersCount: number;
  onPromoteUsers: () => void;
  isPromoting?: boolean;
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedUsersCount,
  onPromoteUsers,
  isPromoting = false
}) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {selectedUsersCount > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPromoteUsers}
            disabled={isPromoting}
          >
            {isPromoting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserCheck className="mr-2 h-4 w-4" />
            )}
            {isPromoting ? "Promoting..." : "Promote to Admin"}
          </Button>
        </div>
      )}
    </div>
  );
};
