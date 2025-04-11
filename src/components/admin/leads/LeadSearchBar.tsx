
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LeadSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const LeadSearchBar: React.FC<LeadSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search leads by name, company, email..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
