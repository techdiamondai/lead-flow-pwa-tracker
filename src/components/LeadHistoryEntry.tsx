import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LeadHistory } from '@/models/Lead';
import { getUserNameById } from '@/services/userService';
import { getStageDisplayName } from '@/services/leadService';

interface LeadHistoryEntryProps {
  entry: LeadHistory;
  formatDate: (dateString: string) => string;
  isFirst: boolean; // To conditionally render Separator
}

export const LeadHistoryEntry: React.FC<LeadHistoryEntryProps> = ({ entry, formatDate, isFirst }) => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    if (entry.updated_by) {
      getUserNameById(entry.updated_by).then(name => {
        if (isMounted) {
          setUserName(name);
        }
      });
    } else {
       setUserName("Unknown User"); // Handle cases where updated_by might be null
    }
    return () => { isMounted = false }; // Cleanup function to prevent state update on unmounted component
  }, [entry.updated_by]);

  return (
    <div className="space-y-2">
      {!isFirst && <Separator />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2">
        <div>
          <Badge variant="outline">{getStageDisplayName(entry.stage)}</Badge>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(entry.timestamp)} by {userName}
          </p>
        </div>
        {/* If there were other details specific to the entry, they would go here */}
      </div>
      {entry.details && (
          <p className="text-sm text-muted-foreground pl-2">{entry.details}</p>
      )}
    </div>
  );
}; 