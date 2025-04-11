
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LineChart,
  Settings,
  LogOut,
  Shield,
  User,
  HelpCircle,
} from "lucide-react";
import { Button } from "./ui/button";

// Define the navigation item type to include adminRequired property
interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  authRequired: boolean;
  adminRequired?: boolean; 
}

export const AppSidebar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [adminStatus, setAdminStatus] = React.useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        try {
          const admin = await isAdmin();
          console.log("Admin status in sidebar:", admin);
          setAdminStatus(admin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setAdminStatus(false);
        }
      } else {
        setAdminStatus(false);
      }
    };
    
    checkAdminStatus();
  }, [isAuthenticated, isAdmin]);

  // Define navigation items based on auth status and admin privileges
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      authRequired: true,
    },
    {
      title: "Leads",
      path: "/leads",
      icon: UserPlus,
      authRequired: true,
    },
  ];

  // Add admin items if user is an admin
  const adminItems: NavItem[] = [
    {
      title: "Admin Panel",
      path: "/admin",
      icon: Shield,
      authRequired: true,
      adminRequired: true,
    },
    {
      title: "User Management",
      path: "/admin/users",
      icon: Users,
      authRequired: true,
      adminRequired: true,
    }
  ];

  // Filter items based on admin status
  const displayItems = [...navItems, ...(adminStatus ? adminItems : [])];
  
  // Helper to determine if a menu item is active
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return null; // Don't show sidebar for unauthenticated users
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-2 px-4 py-3">
          <div className="text-lg font-bold">DiamondFlow</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {displayItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Account" asChild>
                  <Link to="/account">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help" asChild>
                  <Link to="/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};
