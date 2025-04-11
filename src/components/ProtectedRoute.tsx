
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/toast";
import { isAdmin } from "@/hooks/auth/utils/roleUtils";

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
  
  // Check admin status when profile is available
  useEffect(() => {
    if (!requireAdmin) return;
    
    if (profile && isAuthenticated) {
      setIsAdminChecking(true);
      
      const checkAdminStatus = async () => {
        try {
          const adminStatus = await isAdmin(profile);
          console.log("Admin check result:", adminStatus, "for user:", profile.id);
          setIsAdminUser(adminStatus);
        } catch (error) {
          console.error("Admin check error:", error);
          setIsAdminUser(false);
        } finally {
          setIsAdminChecking(false);
        }
      };
      
      checkAdminStatus();
    } else {
      setIsAdminUser(false);
      setIsAdminChecking(false);
    }
  }, [profile, isAuthenticated, requireAdmin]);
  
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
      description: "You need administrator privileges to access this page",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
};
