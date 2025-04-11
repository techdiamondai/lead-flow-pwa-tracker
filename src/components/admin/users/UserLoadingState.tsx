
import React from "react";

export const UserLoadingState: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
      <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
      <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
    </div>
  );
};
