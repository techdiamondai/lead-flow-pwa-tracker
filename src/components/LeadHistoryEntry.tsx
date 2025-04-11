
import React from "react";
import { LeadHistory } from "@/models/Lead";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getStageDisplayName } from "@/services/leadService";
import { getUserNameById } from "@/services/userService";

interface LeadHistoryEntryProps {
  entry: LeadHistory;
  formatDate: (date: string) => string;
  isFirst?: boolean;
}

export const LeadHistoryEntry: React.FC<LeadHistoryEntryProps> = ({
  entry,
  formatDate,
  isFirst = false,
}) => {
  const [userName, setUserName] = React.useState<string>("");

  React.useEffect(() => {
    if (entry.updated_by) {
      getUserNameById(entry.updated_by).then(setUserName);
    }
  }, [entry.updated_by]);

  return (
    <div className={isFirst ? "" : "pt-4"}>
      {!isFirst && <Separator className="mb-4" />}
      <div className="flex justify-between items-start">
        <div>
          <Badge variant="outline" className="mb-2">
            {getStageDisplayName(entry.stage)}
          </Badge>
          <p className="text-sm font-medium">
            Updated by: {userName || "System"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(entry.timestamp)}
          </p>
        </div>
      </div>
      {entry.notes && (
        <div className="mt-2 text-sm">
          <p>{entry.notes}</p>
        </div>
      )}
    </div>
  );
};
