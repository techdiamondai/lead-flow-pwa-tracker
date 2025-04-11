
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
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(requireAdmin);
  const location = useLocation();
  
  // Check admin status when profile is available and admin access is required
  useEffect(() => {
    if (!requireAdmin || !isAuthenticated) return;
    
    const checkAdminStatus = async () => {
      try {
        setIsAdminChecking(true);
        const adminStatus = await isAdmin();
        console.log("Admin check result in ProtectedRoute:", adminStatus, "for path:", location.pathname);
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error("Admin check error:", error);
        setIsAdminUser(false);
      } finally {
        setIsAdminChecking(false);
      }
    };
    
    checkAdminStatus();
  }, [isAdmin, isAuthenticated, requireAdmin, location.pathname]);
  
  // Debug logging
  useEffect(() => {
    console.log("ProtectedRoute - Auth State:", { 
      isAuthenticated, 
      isLoading, 
      isAdminUser,
      isAdminChecking,
      requireAdmin,
      userId: user?.id,
      path: location.pathname
    });
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
  
  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Redirecting to login from:", location.pathname);
    return <Navigate to={requireAdmin ? "/admin-login" : "/login"} state={{ from: location }} replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && !isAdminUser) {
    console.log("Admin access denied, redirecting to dashboard");
    toast({
      title: "Access Denied",
      description: "You do not have administrator privileges",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
};
