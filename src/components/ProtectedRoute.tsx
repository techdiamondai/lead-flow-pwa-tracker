
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAdmin = false
}) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Debug information to help diagnose issues
    console.log("ProtectedRoute - Auth State:", { 
      isAuthenticated, 
      isLoading, 
      isAdmin: isAdmin(),
      requireAdmin,
      user: user?.id,
      path: location.pathname
    });

    // Show toast when authentication fails to redirect
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, isLoading, isAdmin, requireAdmin, user, location.pathname]);
  
  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-36 bg-muted rounded mx-auto"></div>
          <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("Redirecting to login from:", location.pathname);
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    console.log("Admin access denied, redirecting to dashboard");
    // Redirect to dashboard if admin access is required but user is not admin
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
};
