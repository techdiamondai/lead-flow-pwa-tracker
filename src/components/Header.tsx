
// We need to update the Header component to correctly access the user profile name
// Find the code that's causing the error and fix it
// It needs to use profile.name instead of user.name

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

// Create the HeaderNameFix component to access the correct user profile name
export const HeaderNameFix = () => {
  const { profile } = useAuth();
  return profile?.name || "User";
};

// Export the Header component to fix import issues
export const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-4">
          <HeaderNameFix />
        </div>
      </div>
    </header>
  );
};
