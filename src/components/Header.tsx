
// We need to update the Header component to correctly access the user profile name
// Find the code that's causing the error and fix it
// It needs to use profile.name instead of user.name

// Note: The file is read-only, so we'll need to create a wrapper component instead
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const HeaderNameFix = () => {
  const { profile } = useAuth();
  return profile?.name || "User";
};
