
import React, { useEffect, useState } from "react";
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
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(requireAdmin);
  const location = useLocation();
  
  useEffect(() => {
    // Only check admin status if required
    if (requireAdmin && profile && isAuthenticated) {
      setIsAdminChecking(true);
      
      // Import the isAdmin function dynamically to prevent circular dependencies
      import("@/hooks/auth/utils/roleUtils").then(({ isAdmin }) => {
        isAdmin(profile).then((result) => {
          setIsAdminUser(result);
          setIsAdminChecking(false);
        });
      });
    }
  }, [requireAdmin, isAuthenticated, profile]);
  
  useEffect(() => {
    // Debug information to help diagnose issues
    console.log("ProtectedRoute - Auth State:", { 
      isAuthenticated, 
      isLoading, 
      isAdminUser,
      isAdminChecking,
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
  }, [isAuthenticated, isLoading, isAdminUser, requireAdmin, user, location.pathname, isAdminChecking]);
  
  // Show loading state while checking authentication or admin status
  if (isLoading || isAdminChecking) {
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
    // Redirect to appropriate login page based on whether admin access is required
    return <Navigate to={requireAdmin ? "/admin-login" : "/login"} state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdminUser) {
    console.log("Admin access denied, redirecting to dashboard");
    // Redirect to dashboard if admin access is required but user is not admin
    toast({
      title: "Access Denied",
      description: "You need administrator privileges to access this page",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
};
